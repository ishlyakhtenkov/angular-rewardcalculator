import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Department } from 'src/app/common/department';
import { DepartmentReward } from 'src/app/common/department-reward';
import { DepartmentRewardTo } from 'src/app/common/department-reward-to';
import { PaymentPeriod } from 'src/app/common/payment-period';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DepartmentRewardService } from 'src/app/services/department-reward.service';
import { DepartmentService } from 'src/app/services/department.service';
import { ErrorHandlingService } from 'src/app/services/error-handling.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PaymentPeriodService } from 'src/app/services/payment-period.service';

@Component({
  selector: 'app-department-reward',
  templateUrl: './department-reward.component.html',
  styleUrls: ['./department-reward.component.css']
})
export class DepartmentRewardComponent implements OnInit {

  departments: Department[] = [];
  selectedDepartment: Department = null;
  paymentPeriods: PaymentPeriod[] = [];
  departmentRewards: DepartmentReward[] = [];

  departmentRewardAddFormGroup: FormGroup;
  departmentRewardEditFormGroup: FormGroup;
  editedDepartmentRewardPeriod: string;

  refreshing: boolean;

  //pagination properties
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;    

  constructor(private departmentRewardService: DepartmentRewardService, private departmentService: DepartmentService, 
    private paymentPeriodService: PaymentPeriodService, private notificationService: NotificationService,
    private formBuilder: FormBuilder, private errorHandlingService: ErrorHandlingService, 
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.getDepartments();
    this.makeDepartmentRewardAddFormGroup();
    this.makeDepartmentRewardEditFormGroup();
  }

  getDepartments() {
    this.refreshing = true;
    if (this.authenticationService.isDepartmentHeadOnly()) {
      this.departments = this.authenticationService.getManagedDepartments();
      this.selectDepartment();
      this.listDepartmentRewards();
    } else {
      this.departmentService.getDepartmentList().subscribe(
        (response: Department[]) => {
          this.departments = response;
          this.selectDepartment();
          this.listDepartmentRewards();
        },
        (errorResponse: HttpErrorResponse) => {
          this.errorHandlingService.handleErrorResponse(errorResponse);
          this.refreshing = false;
        }
      );
    }
  }

  private selectDepartment() {
    if (this.departments.length > 0) {
      if (this.selectedDepartment != null) {
        let selectedDepartmentIndex = this.departments.findIndex(tempDepartment => tempDepartment.name === this.selectedDepartment.name);
        if (selectedDepartmentIndex != -1) {
          this.selectedDepartment = this.departments[selectedDepartmentIndex];
        } else {
          this.selectedDepartment = this.departments[0];
        }
      } else {
        this.selectedDepartment = this.departments[0];
      }
    } else {
      this.selectedDepartment = null;
      this.refreshing = false;
    }
  }

  listDepartmentRewards() {
    if (this.selectedDepartment != null) {
      this.refreshing = true;
      this.departmentRewardService.getDepartmentRewardListPaginate(this.selectedDepartment.id, this.pageNumber - 1, this.pageSize).subscribe(
        response => {
          this.departmentRewards = response.content;
          this.pageNumber = response.pageable.page + 1;
          this.pageSize = response.pageable.size;
          this.totalElements = response.total;
          this.refreshing = false;
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 422) {
            this.getDepartments();
          }
          this.errorHandlingService.handleErrorResponse(errorResponse);
          this.refreshing = false;
        }
      );
    } else {
      this.refreshing = false;
    }
  }

  private getPaymentPeriods() {
    this.paymentPeriodService.getPaymentPeriodList().subscribe(
      (response: PaymentPeriod[]) => {
        this.paymentPeriods = response;
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponse(errorResponse);
      }
    );
  }

  makeDepartmentRewardAddFormGroup() {
    this.departmentRewardAddFormGroup = this.formBuilder.group({
      departmentReward: this.formBuilder.group({
        department: new FormControl((this.selectedDepartment != null) ? this.selectedDepartment : '', [Validators.required]),
        paymentPeriod: new FormControl('', [Validators.required]),
        allocatedAmount: new FormControl('', [Validators.required, Validators.min(0), Validators.max(5000000)])
      })
    });
    this.selectFirstPaymentPeriodOnAddForm();
  }

  private selectFirstPaymentPeriodOnAddForm() {
    this.paymentPeriodService.getPaymentPeriodList().subscribe(
      (response: PaymentPeriod[]) => {
        this.paymentPeriods = response;
        if (this.paymentPeriods.length > 0) {
          this.paymentPeriod.setValue(this.paymentPeriods[0]);
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponse(errorResponse);
      }
    );
  }

  // Submit Add Department Reward Form
  onAddNewDepartmentReward() {
    if (this.departmentRewardAddFormGroup.invalid) {
      this.departmentRewardAddFormGroup.markAllAsTouched();
    } else {
      let newDepartmentRewardTo = new DepartmentRewardTo(null, this.department.value.id, this.paymentPeriod.value.id, this.allocatedAmount.value);
      this.departmentRewardService.createDepartmentReward(newDepartmentRewardTo).subscribe(
        (response: DepartmentReward) => {
          this.selectedDepartment = this.department.value;
          document.getElementById("departmentReward-add-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `New department reward '${this.formatPaymentPeriodDate(response.paymentPeriod.period)}' for '${this.selectedDepartment.name}' was created`);
          this.listDepartmentRewards();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 422) {
            this.refreshAddFormData();
          }
          this.errorHandlingService.handleErrorResponseWithButtonClick(errorResponse, "departmentReward-add-modal-close");
        }
      );
    }
  }

  private refreshAddFormData() {
    this.department.setValue('');
    this.paymentPeriod.setValue('');
    this.getDepartments();
    this.getPaymentPeriods();
  }

  private makeDepartmentRewardEditFormGroup() {
    this.departmentRewardEditFormGroup = this.formBuilder.group({
      departmentReward: this.formBuilder.group({
        id: [''],
        paymentPeriodEdited: [''],
        allocatedAmountEdited: new FormControl('', [Validators.required, Validators.min(0), Validators.max(5000000)])
      })
    });
  }


  prepareDepartmentRewardEditFormGroup(departmentReward: DepartmentReward) {
    this.editedDepartmentRewardPeriod = this.formatPaymentPeriodDate(departmentReward.paymentPeriod.period);
    this.departmentRewardEditFormGroup = this.formBuilder.group({
      departmentReward: this.formBuilder.group({
        id: [departmentReward.id],
        paymentPeriodEdited: [departmentReward.paymentPeriod],
        allocatedAmountEdited: new FormControl(departmentReward.allocatedAmount, [Validators.required, Validators.min(0), Validators.max(5000000)])
      })
    });

  }

  // Submit Edit Department Reward Form
  onUpdateDepartmentReward() {
    if (this.departmentRewardEditFormGroup.invalid) {
      this.departmentRewardEditFormGroup.markAllAsTouched();
    } else {
      let updatedDepartmentRewardTo = new DepartmentRewardTo(this.id.value, this.selectedDepartment.id, this.paymentPeriodEdited.value.id, this.allocatedAmountEdited.value);
      this.departmentRewardService.updateDepartmentReward(updatedDepartmentRewardTo).subscribe(
        response => {
          document.getElementById("departmentReward-edit-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The department reward '${this.formatPaymentPeriodDate(this.paymentPeriodEdited.value.period)}' for '${this.selectedDepartment.name}' was updated`);
          this.listDepartmentRewards();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 422) {
            // document.getElementById("departmentReward-edit-modal-close").click();
            this.getDepartments();
          }
          this.errorHandlingService.handleErrorResponseWithButtonClick(errorResponse, "departmentReward-edit-modal-close");
        }
      );
    }
  }

  deleteDepartmentReward(id: number, period: Date) {
    if (confirm(`Are you sure want to delete department reward '${this.formatPaymentPeriodDate(period)}' for department '${this.selectedDepartment.name}'?`)) {
      this.departmentRewardService.deleteDepartmentReward(id).subscribe(
        response => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The department reward '${this.formatPaymentPeriodDate(period)}' for department '${this.selectedDepartment.name}' was deleted`);
          this.listDepartmentRewards();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 422) {
            this.listDepartmentRewards();
          }
          this.errorHandlingService.handleErrorResponse(errorResponse);        }
      );
    }
  }

  refresh() {
    this.refreshing = true;
    this.pageNumber = 1;
    this.getDepartments();
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listDepartmentRewards();
  }

  private formatPaymentPeriodDate(period: Date): string {
    return formatDate(period, 'MMMM yyyy', 'en-US');
  }

  isAdminOrEconomist(): boolean {
    return (this.authenticationService.isAdmin() || this.authenticationService.isEconomist());
  }

  // Getters for departmentRewardAddFormGroup values
  get department() {
    return this.departmentRewardAddFormGroup.get('departmentReward.department');
  }
  get paymentPeriod() {
    return this.departmentRewardAddFormGroup.get('departmentReward.paymentPeriod');
  }
  get allocatedAmount() {
    return this.departmentRewardAddFormGroup.get('departmentReward.allocatedAmount');
  }

  // Getters for departmentRewardEditFormGroup values
  get id() {
    return this.departmentRewardEditFormGroup.get('departmentReward.id');
  }
  get paymentPeriodEdited() {
    return this.departmentRewardEditFormGroup.get('departmentReward.paymentPeriodEdited');
  }
  get allocatedAmountEdited() {
    return this.departmentRewardEditFormGroup.get('departmentReward.allocatedAmountEdited');
  }
}
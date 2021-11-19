import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Department } from 'src/app/common/department';
import { DepartmentReward } from 'src/app/common/department-reward';
import { EmployeeReward } from 'src/app/common/employee-reward';
import { EmployeeRewardTo } from 'src/app/common/employee-reward-to';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DepartmentRewardService } from 'src/app/services/department-reward.service';
import { DepartmentService } from 'src/app/services/department.service';
import { EmployeeRewardService } from 'src/app/services/employee-reward.service';
import { ErrorHandlingService } from 'src/app/services/error-handling.service';
import { NotificationService } from 'src/app/services/notification.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-employee-reward',
  templateUrl: './employee-reward.component.html',
  styleUrls: ['./employee-reward.component.css']
})
export class EmployeeRewardComponent implements OnInit {

  departments: Department[] = [];
  selectedDepartment: Department = null;
  departmentRewards: DepartmentReward[] = [];
  employeeRewards: EmployeeReward[] = [];
  selectedDepartmentReward: DepartmentReward = null;

  employeeRewardEditFormGroup: FormGroup;
  editedEmployeeRewardDescription: string;
  approvingSignatureFormGroup: FormGroup;

  refreshing: boolean;

  constructor(private departmentRewardService: DepartmentRewardService, private departmentService: DepartmentService, 
    private employeeRewardService: EmployeeRewardService, private notificationService: NotificationService,
    private formBuilder: FormBuilder, private errorHandlingService: ErrorHandlingService, 
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.getDepartments();
    this.makeEmployeeRewardEditFormGroup();
    this.makeApprovingSignatureFormGroup();
  }

  getDepartments() {
    this.refreshing = true;
    if (this.authenticationService.isDepartmentHeadOnly()) {
      this.departments = this.authenticationService.getManagedDepartments();
      this.selectDepartment();
      this.getDepartmentRewards();
    } else {
      this.departmentService.getDepartmentList().subscribe(
        (response: Department[]) => {
          this.departments = response;
          this.selectDepartment();
          this.getDepartmentRewards();
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

  getDepartmentRewards() {
    if (this.selectedDepartment != null) {
      this.refreshing = true;
      this.departmentRewardService.getDepartmentRewardList(this.selectedDepartment.id).subscribe(
        (response: DepartmentReward[]) => {
          this.departmentRewards = response;
          this.selectDepartmentReward();
          this.listEmployeeRewards();
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

  private selectDepartmentReward() {
    if (this.departmentRewards.length > 0) {
      if (this.selectedDepartmentReward != null) {
        let selectedDepartmentRewardIndex = this.departmentRewards.findIndex(tempDepartmentReward => tempDepartmentReward.id === this.selectedDepartmentReward.id);
        if (selectedDepartmentRewardIndex != -1) {
          this.selectedDepartmentReward = this.departmentRewards[selectedDepartmentRewardIndex];
        } else {
          this.selectedDepartmentReward = this.departmentRewards[0];
        }
      } else {
        this.selectedDepartmentReward = this.departmentRewards[0];
      }
    } else {
      this.selectedDepartmentReward = null;
      this.refreshing = false;
    }
  }

  listEmployeeRewards() {
    if (this.selectedDepartmentReward != null) {
      this.refreshing = true;
      this.employeeRewardService.getEmployeeRewardList(this.selectedDepartmentReward.id).subscribe(
        (response: EmployeeReward[]) => {
          this.employeeRewards = response;
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
      this.employeeRewards = [];
      this.refreshing = false;
    }    
  }

  calculateFullReward(employeeReward: EmployeeReward): number {
    return employeeReward.hoursWorkedReward + employeeReward.additionalReward - employeeReward.penalty;
  }

  calculateFullRewardAsPercentageOfSalary(employeeReward: EmployeeReward): number {
    let percentage = this.calculateFullReward(employeeReward) / employeeReward.employee.position.salary * 100;
    return Math.floor(percentage);
  }

  getEmployeeRewardsInPdfWithoutApprovingSignature() {
    document.getElementById("question-modal-close").click();
    if (this.selectedDepartmentReward != null) {
      this.employeeRewardService.getEmployeeRewardListInPdf(this.selectedDepartmentReward.id).subscribe(
        response => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The employee rewards pdf form '${this.selectedDepartment.name}, ${this.formatPaymentPeriodDate(this.selectedDepartmentReward.paymentPeriod.period)}' was created`);
          this.downloadPdfFile(response);
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 422) {
            this.getDepartments();
          }
          this.errorHandlingService.handleErrorResponse(errorResponse);
        }
      );
    }
  }

  private downloadPdfFile(response: any) {
    let pdfBlob = new Blob([response], { type: 'application/pdf' });
    let data = window.URL.createObjectURL(pdfBlob);
    let fileName = `Employee rewards_${this.selectedDepartment.name}, ${this.formatPaymentPeriodDate(this.selectedDepartmentReward.paymentPeriod.period)}`;
    let link = document.createElement('a');
    link.href = data;
    link.download = fileName;
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    setTimeout(function () {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
  }

  openApprovingSignatureForm() {
    this.makeApprovingSignatureFormGroup();
    document.getElementById("approvingSignature-modal-open")?.click();
    document.getElementById("question-modal-close").click();
  }

  private makeApprovingSignatureFormGroup() {
    this.approvingSignatureFormGroup = this.formBuilder.group({
      approvingSignature: this.formBuilder.group({
        approvingPosition: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(100), CustomValidators.notOnlyWhitespace]),
        approvingName: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(50), CustomValidators.notOnlyWhitespace])
      })
    });
  }

  private makeEmployeeRewardEditFormGroup() {
    this.employeeRewardEditFormGroup = this.formBuilder.group({
      employeeReward: this.formBuilder.group({
        id: [''],
        hoursWorkedEdited: new FormControl('', [Validators.required, Validators.min(0), Validators.max(300)]),
        additionalRewardEdited: new FormControl('', [Validators.required, Validators.min(0), Validators.max(5000000)]),
        penaltyEdited: new FormControl('', [Validators.required, Validators.min(0), Validators.max(5000000)])
      })
    });
  }

  onAddApprovingSignature() {
    if (this.approvingSignatureFormGroup.invalid) {
      this.approvingSignatureFormGroup.markAllAsTouched();
    } else {
      let approvingPosition = this.approvingPosition.value;
      let approvingName = this.approvingName.value;
      this.employeeRewardService.getEmployeeRewardListInPdfWithApprovingSignature(this.selectedDepartmentReward.id, 
        approvingPosition, approvingName).subscribe(
        response => {
          document.getElementById("approvingSignature-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The employee rewards pdf form '${this.selectedDepartment.name}--${this.formatPaymentPeriodDate(this.selectedDepartmentReward.paymentPeriod.period)}' was created`);
          this.downloadPdfFile(response);
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 422) {
            this.getDepartments();
          }
          this.errorHandlingService.handleErrorResponse(errorResponse);
        }
      );
    }
  }

  prepareEmployeeRewardEditFormGroup(employeeReward: EmployeeReward) {
    this.editedEmployeeRewardDescription = `${employeeReward.employee.name}, ${this.formatPaymentPeriodDate(this.selectedDepartmentReward.paymentPeriod.period)}`;
    this.employeeRewardEditFormGroup = this.formBuilder.group({
      employeeReward: this.formBuilder.group({
        id: [employeeReward.id],
        hoursWorkedEdited: new FormControl(employeeReward.hoursWorked, [Validators.required, Validators.min(0), Validators.max(300)]),
        additionalRewardEdited: new FormControl(employeeReward.additionalReward, [Validators.required, Validators.min(0), Validators.max(5000000)]),
        penaltyEdited: new FormControl(employeeReward.penalty, [Validators.required, Validators.min(0), Validators.max(5000000)])
      })
    });
  }

  // Submit Edit Employee Reward Form
  onUpdateEmployeeReward() {
    if (this.employeeRewardEditFormGroup.invalid) {
      this.employeeRewardEditFormGroup.markAllAsTouched();
    } else {
      let updatedEmployeeRewardTo = new EmployeeRewardTo(this.id.value, this.hoursWorkedEdited.value, this.additionalRewardEdited.value, this.penaltyEdited.value);
      this.employeeRewardService.updateEmployeeReward(updatedEmployeeRewardTo).subscribe(
        response => {
          document.getElementById("employeeReward-edit-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The employee reward '${this.editedEmployeeRewardDescription}' was updated`);
          this.refreshSelectedDepartmentReward();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 422) {
            // document.getElementById("employeeReward-edit-modal-close").click();
            this.getDepartments();
          }
          this.errorHandlingService.handleErrorResponseWithButtonClick(errorResponse, "employeeReward-edit-modal-close");
        }
      );
    }
  }

  private refreshSelectedDepartmentReward() {
    this.departmentRewardService.getDepartmentReward(this.selectedDepartmentReward.id).subscribe(
      (response: DepartmentReward) => {
        this.selectedDepartmentReward.distributedAmount = response.distributedAmount;
        this.selectedDepartmentReward.allocatedAmount = response.allocatedAmount;
        this.listEmployeeRewards();
      },
      (errorResponse: HttpErrorResponse) => {
        if (errorResponse.status == 422) {
          this.getDepartments();
        }
        this.errorHandlingService.handleErrorResponse(errorResponse);
        this.refreshing = false;
      }
    );
  }

  private formatPaymentPeriodDate(period: Date): string {
    return formatDate(period, 'MMMM yyyy', 'en-US');
  }

  // Getters for employeeRewardEditFormGroup values
  get id() {
    return this.employeeRewardEditFormGroup.get('employeeReward.id');
  }
  get hoursWorkedEdited() {
    return this.employeeRewardEditFormGroup.get('employeeReward.hoursWorkedEdited');
  }
  get additionalRewardEdited() {
    return this.employeeRewardEditFormGroup.get('employeeReward.additionalRewardEdited');
  }
  get penaltyEdited() {
    return this.employeeRewardEditFormGroup.get('employeeReward.penaltyEdited');
  }

  // Getters for approvingSignatureFormGroup values
  get approvingPosition() {
    return this.approvingSignatureFormGroup.get('approvingSignature.approvingPosition');
  }
  get approvingName() {
    return this.approvingSignatureFormGroup.get('approvingSignature.approvingName');
  }
}
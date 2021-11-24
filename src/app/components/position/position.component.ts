import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Department } from 'src/app/common/department';
import { Position } from 'src/app/common/position';
import { PositionTo } from 'src/app/common/position-to';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DepartmentService } from 'src/app/services/department.service';
import { ErrorHandlingService } from 'src/app/services/error-handling.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PositionService } from 'src/app/services/position.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  departments: Department[] = [];
  selectedDepartment: Department = null;
  positions: Position[] = [];

  positionAddFormGroup: FormGroup;
  positionEditFormGroup: FormGroup;
  editedPositionName: string;

  refreshing: boolean;

  constructor(private positionService: PositionService, private departmentService: DepartmentService, private notificationService: NotificationService,
    private formBuilder: FormBuilder, private errorHandlingService: ErrorHandlingService,
    private authenticationService: AuthenticationService, private sharedDataService: SharedDataService) { }

  ngOnInit(): void {
    this.subscription = this.sharedDataService.currentSelectedDepartment.subscribe(selectedDepartment => this.selectedDepartment = selectedDepartment);
    this.getDepartments();
    this.makePositionAddFormGroup();
    this.makePositionEditFormGroup();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getDepartments() {
    this.refreshing = true;
    if (this.authenticationService.isDepartmentHeadOnly()) {
      this.departments = this.authenticationService.getManagedDepartments();
      this.selectDepartment();
    } else {
      this.departmentService.getDepartmentList().subscribe(
        (response: Department[]) => {
          this.departments = response;
          this.selectDepartment();
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
        let selectedDepartmentIndex = this.departments.findIndex(tempDepartment => tempDepartment.id === this.selectedDepartment.id);
        if (selectedDepartmentIndex != -1) {
          this.selectedDepartment = this.departments[selectedDepartmentIndex];
        } else {
          this.selectedDepartment = this.departments[0];
        }
      } else {
        this.selectedDepartment = this.departments[0];
      }
      this.listPositions();
    } else {
      this.selectedDepartment = null;
      this.refreshing = false;
    }
  }

  listPositions() {
    this.refreshing = true;
    this.sharedDataService.changeSelectedDepartment(this.selectedDepartment);
    this.positionService.getPositionList(this.selectedDepartment.id).subscribe(
      (response: Position[]) => {
        this.positions = response;
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
  }

  makePositionAddFormGroup() {
    this.positionAddFormGroup = this.formBuilder.group({
      position: this.formBuilder.group({
        name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(70), CustomValidators.notOnlyWhitespace]),
        salary: new FormControl('', [Validators.required, Validators.min(10000)]),
        chiefPosition: [false],
        department: new FormControl((this.selectedDepartment != null) ? this.selectedDepartment : '', [Validators.required])
      })
    });
  }

  private makePositionEditFormGroup() {
    this.positionEditFormGroup = this.formBuilder.group({
      position: this.formBuilder.group({
        id: [''],
        nameEdited: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(70), CustomValidators.notOnlyWhitespace]),
        salaryEdited: new FormControl('', [Validators.required, Validators.min(10000)]),
        chiefPositionEdited: [false]
      })
    });
  }

  // Submit Add Position Form
  onAddNewPosition() {
    if (this.positionAddFormGroup.invalid) {
      this.positionAddFormGroup.markAllAsTouched();
    } else {
      let newPositionTo = new PositionTo(null, this.name.value, this.salary.value, this.chiefPosition.value, this.department.value.id);
      this.positionService.createPosition(newPositionTo).subscribe(
        (response: Position) => {
          this.selectedDepartment = this.department.value;
          document.getElementById("position-add-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `New position '${response.name}' was created`);
          this.listPositions();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 422) {
            this.getDepartments();
            this.department.setValue('');
          }
          this.errorHandlingService.handleErrorResponseWithButtonClick(errorResponse, "position-add-modal-close");
        }
      );
    }
  }

  preparePositionEditFormGroup(position: Position) {
    this.editedPositionName = position.name;
    this.positionEditFormGroup = this.formBuilder.group({
      position: this.formBuilder.group({
        id: [position.id],
        nameEdited: new FormControl(position.name, [Validators.required, Validators.minLength(4), Validators.maxLength(70), CustomValidators.notOnlyWhitespace]),
        salaryEdited: new FormControl(position.salary, [Validators.required, Validators.min(10000)]),
        chiefPositionEdited: [position.chiefPosition]
      })
    });
  }

  // Submit Edit Position Form
  onUpdatePosition() {
    if (this.positionEditFormGroup.invalid) {
      this.positionEditFormGroup.markAllAsTouched();
    } else {
      let updatedPositionTo = new PositionTo(this.id.value, this.nameEdited.value, this.salaryEdited.value, this.chiefPositionEdited.value, this.selectedDepartment.id);
      this.positionService.updatePosition(updatedPositionTo).subscribe(
        response => {
          document.getElementById("position-edit-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The position '${updatedPositionTo.name}' was updated`);
          this.listPositions();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 422) {
            // document.getElementById("position-edit-modal-close").click();
            this.getDepartments();
          }
          this.errorHandlingService.handleErrorResponseWithButtonClick(errorResponse, "position-edit-modal-close");
        }
      );
    }
  }

  deletePosition(id: number, name: string) {
    if (confirm(`Are you sure want to delete position '${name}'?`)) {
      this.positionService.deletePosition(id).subscribe(
        response => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The position '${name}' was deleted`);
          this.listPositions();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 422) {
            this.listPositions();
          }
          this.errorHandlingService.handleErrorResponse(errorResponse);        }
      );
    }
  }

  isAdminOrPersonnelOfficer(): boolean {
    return (this.authenticationService.isAdmin() || this.authenticationService.isPersonnelOfficer());
  }

  // Getters for positionAddFormGroup values
  get name() {
    return this.positionAddFormGroup.get('position.name');
  }
  get salary() {
    return this.positionAddFormGroup.get('position.salary');
  }
  get chiefPosition() {
    return this.positionAddFormGroup.get('position.chiefPosition');
  }
  get department() {
    return this.positionAddFormGroup.get('position.department');
  }

  // Getters for positionEditFormGroup values
  get id() {
    return this.positionEditFormGroup.get('position.id');
  }
  get nameEdited() {
    return this.positionEditFormGroup.get('position.nameEdited');
  }
  get salaryEdited() {
    return this.positionEditFormGroup.get('position.salaryEdited');
  }
  get chiefPositionEdited() {
    return this.positionEditFormGroup.get('position.chiefPositionEdited');
  }
}
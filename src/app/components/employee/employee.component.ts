import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Department } from 'src/app/common/department';
import { Employee } from 'src/app/common/employee';
import { EmployeeTo } from 'src/app/common/employee-to';
import { Position } from 'src/app/common/position';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { Rates } from 'src/app/enums/rates.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DepartmentService } from 'src/app/services/department.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ErrorHandlingService } from 'src/app/services/error-handling.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PositionService } from 'src/app/services/position.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { StringUtil } from 'src/app/utils/string-util';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  departments: Department[] = [];
  selectedDepartment: Department = null;
  employees: Employee[] = [];
  positions: Position[] = [];

  employeeAddFormGroup: FormGroup;
  employeeEditFormGroup: FormGroup;
  editedEmployeeName: string;

  refreshing: boolean;

  constructor(private employeeService: EmployeeService, private departmentService: DepartmentService, 
    private positionService: PositionService, private notificationService: NotificationService, private formBuilder: FormBuilder, 
    private errorHandlingService: ErrorHandlingService, private authenticationService: AuthenticationService, 
    private sharedDataService: SharedDataService) { }

  ngOnInit(): void {
    this.subscription = this.sharedDataService.currentSelectedDepartment.subscribe(selectedDepartment => this.selectedDepartment = selectedDepartment);
    this.getDepartments();
    this.makeEmployeeAddFormGroup();
    this.makeEmployeeEditFormGroup();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getDepartments() {
    this.refreshing = true;
    if (this.authenticationService.isDepartmentHeadOnly()) {
      this.departments = this.authenticationService.getManagedDepartments();
      this.selectDepartment();
      this.listEmployees();
    } else {
      this.departmentService.getDepartmentList().subscribe(
        (response: Department[]) => {
          this.departments = response;
          this.selectDepartment();
          this.listEmployees();
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
    } else {
      this.selectedDepartment = null;
      this.refreshing = false;
    }
  }

  listEmployees() {
    if (this.selectedDepartment != null) {
      this.refreshing = true;
      this.sharedDataService.changeSelectedDepartment(this.selectedDepartment);
      this.employeeService.getEmployeeList(this.selectedDepartment.id).subscribe(
        (response: Employee[]) => {
          this.employees = response;
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

  makeEmployeeAddFormGroup() {
    this.employeeAddFormGroup = this.formBuilder.group({
      employee: this.formBuilder.group({
        name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(70), CustomValidators.notOnlyWhitespace]),
        department: new FormControl((this.selectedDepartment != null) ? this.selectedDepartment : '', [Validators.required]),
        position: new FormControl('', [Validators.required]),
        rate: new FormControl(Rates.FULL_RATE, [Validators.required]),
      })
    });
    this.getPositionsForAddForm();
  }

  getPositionsForAddForm() {
    this.positions = null;
    if (this.department.value.id != undefined) {
      this.positionService.getPositionList(this.department.value.id).subscribe(
        (response: Position[]) => {
          this.positions = response;
          if (this.positions.length > 0) {
            this.position.setValue(this.positions[0]);
          } else {
            this.position.setValue('');
          }
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 422) {
            this.refreshAddFormData();
          }
          this.errorHandlingService.handleErrorResponse(errorResponse);
        }
      );
    }
  }

  // Submit Add Employee Form
  onAddNewEmployee() {
    if (this.employeeAddFormGroup.invalid) {
      this.employeeAddFormGroup.markAllAsTouched();
    } else {
      let newEmployeeTo = new EmployeeTo(null, this.name.value, this.rate.value, this.position.value.id);
      this.employeeService.createEmployee(newEmployeeTo).subscribe(
        (response: Employee) => {
          this.selectedDepartment = this.department.value;
          document.getElementById("employee-add-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `New employee '${response.name}' was created`);
          this.listEmployees();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 422) {
            this.refreshAddFormData();
          }
          this.errorHandlingService.handleErrorResponseWithButtonClick(errorResponse, "employee-add-modal-close");
        }
      );
    }
  }

  private refreshAddFormData() {
    this.positions = null;
    this.getDepartments();
    this.department.setValue('');
    this.position.setValue('');
  }

  private makeEmployeeEditFormGroup() {
    this.employeeEditFormGroup = this.formBuilder.group({
      employee: this.formBuilder.group({
        id: [''],
        nameEdited: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(70), CustomValidators.notOnlyWhitespace]),
        departmentEdited: new FormControl('', [Validators.required]),
        positionEdited: new FormControl('', [Validators.required]),
        rateEdited: new FormControl('', [Validators.required])
      })
    });
  }

  prepareEmployeeEditFormGroup(employee: Employee) {
    this.editedEmployeeName = employee.name;
    this.positionService.getPositionList(this.selectedDepartment.id).subscribe(
      (response: Position[]) => {
        this.positions = response;
        let selectedPosition = this.getSelectedPosition(employee);
        this.employeeEditFormGroup = this.formBuilder.group({
          employee: this.formBuilder.group({
            id: [employee.id],
            nameEdited: new FormControl(employee.name, [Validators.required, Validators.minLength(4), Validators.maxLength(70), CustomValidators.notOnlyWhitespace]),
            departmentEdited: new FormControl(this.selectedDepartment, [Validators.required]),
            positionEdited: new FormControl(selectedPosition != null ? selectedPosition : '', [Validators.required]),
            rateEdited: new FormControl(employee.rate, [Validators.required])
          })
        });
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponse(errorResponse);
      }
    );
  }

  private getSelectedPosition(employee: Employee): Position {
    let selectedPositionIndex = this.positions.findIndex(position => position.id === employee.position.id);
    if (selectedPositionIndex != -1) {
      return this.positions[selectedPositionIndex];
    } else if (this.positions.length > 0){
      return this.positions[0];
    } else {
      return null;
    }
  }

  getPositionsForEditForm() {
    this.positions = null;
    if (this.departmentEdited.value.id != undefined) {
      this.positionService.getPositionList(this.departmentEdited.value.id).subscribe(
        (response: Position[]) => {
          this.positions = response;
          if (this.positions.length > 0) {
            this.positionEdited.setValue(this.positions[0]);
          } else {
            this.positionEdited.setValue('');
          }
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 422) {
            this.refreshEditFormData();
          }
          this.errorHandlingService.handleErrorResponse(errorResponse);
        }
      );
    }
  }

  // Submit Edit Employee Form
  onUpdateEmployee() {
    if (this.employeeEditFormGroup.invalid) {
      this.employeeEditFormGroup.markAllAsTouched();
    } else {
      let updateEmployeeTo = new EmployeeTo(this.id.value, this.nameEdited.value, this.rateEdited.value, this.positionEdited.value.id);
      this.employeeService.updateEmployee(updateEmployeeTo).subscribe(
        response => {
          document.getElementById("employee-edit-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The employee '${updateEmployeeTo.name}' was updated`);
          this.selectedDepartment = this.departmentEdited.value;
          this.listEmployees();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 422) {
            this.refreshEditFormData();
          }
          this.errorHandlingService.handleErrorResponseWithButtonClick(errorResponse, "employee-edit-modal-close");
        }
      );
    }
  }

  private refreshEditFormData() {
    this.departmentService.getDepartmentList().subscribe(
      (response: Department[]) => {
        this.departments = response;
        this.selectDepartment();
        if (this.selectedDepartment != null) {
          this.departmentEdited.setValue(this.selectedDepartment);
          this.positionService.getPositionList(this.departmentEdited.value.id).subscribe(
            (response: Position[]) => {
              this.positions = response;
              if (this.positions.length > 0) {
                this.positionEdited.setValue(this.positions[0]);
              } else {
                this.positionEdited.setValue('');
              }
            },
            (errorResponse: HttpErrorResponse) => {
              this.errorHandlingService.handleErrorResponse(errorResponse);
            });
            this.listEmployees();
        } else {
          this.departmentEdited.setValue('');
          this.positionEdited.setValue('');
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponse(errorResponse);
      }
    );
  }

  deleteEmployee(id: number, name: string) {
    if (confirm(`Are you sure want to delete employee '${name}'?`)) {
      this.employeeService.deleteEmployee(id).subscribe(
        response => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The employee '${name}' was deleted`);
          this.listEmployees();
        },
        (errorResponse: HttpErrorResponse) => {
          this.listEmployees();
          this.errorHandlingService.handleErrorResponse(errorResponse);        }
      );
    }
  }

  isAdminOrPersonnelOfficer(): boolean {
    return (this.authenticationService.isAdmin() || this.authenticationService.isPersonnelOfficer());
  }

  calculateEmployeeSalary(employee: Employee): number {
    let positionSalary = employee.position.salary;
    let rate = employee.rate;
    let rateCoefficient;
    if (rate === Rates.FULL_RATE) {
      rateCoefficient = 1;
    } else if (rate === Rates.HALF_RATE) {
      rateCoefficient = 0.5;
    } else if (rate === Rates.QUARTER_RATE) {
      rateCoefficient = 0.25;
    } else {
      rateCoefficient = -1;
    }
    return positionSalary * rateCoefficient;
  }

  prepareRateForShowing(rate: string): string {
    return StringUtil.UpperCaseFirstLettersOfWords(rate.replace('_', ' '));
  }


  // Getters for employeeAddFormGroup values
  get name() {
    return this.employeeAddFormGroup.get('employee.name');
  }
  get department() {
    return this.employeeAddFormGroup.get('employee.department');
  }
  get position() {
    return this.employeeAddFormGroup.get('employee.position');
  }
  get rate() {
    return this.employeeAddFormGroup.get('employee.rate');
  }

  // Getters for employeeEditFormGroup values
  get id() {
    return this.employeeEditFormGroup.get('employee.id');
  }
  get nameEdited() {
    return this.employeeEditFormGroup.get('employee.nameEdited');
  }
  get departmentEdited() {
    return this.employeeEditFormGroup.get('employee.departmentEdited');
  }
  get positionEdited() {
    return this.employeeEditFormGroup.get('employee.positionEdited');
  }
  get rateEdited() {
    return this.employeeEditFormGroup.get('employee.rateEdited');
  }
}
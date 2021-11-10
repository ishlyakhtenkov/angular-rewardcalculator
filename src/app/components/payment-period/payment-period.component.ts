import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentPeriod } from 'src/app/common/payment-period';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorHandlingService } from 'src/app/services/error-handling.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PaymentPeriodService } from 'src/app/services/payment-period.service';

@Component({
  selector: 'app-payment-period',
  templateUrl: './payment-period.component.html',
  styleUrls: ['./payment-period.component.css']
})
export class PaymentPeriodComponent implements OnInit {

  paymentPeriods: PaymentPeriod[];

  paymentPeriodAddFormGroup: FormGroup;
  paymentPeriodEditFormGroup: FormGroup;
  editedPaymentPeriod: string;

  refreshing: boolean;

  //pagination properties
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;  

  constructor(private paymentPeriodService: PaymentPeriodService, private notificationService: NotificationService,
    private formBuilder: FormBuilder, private errorHandlingService: ErrorHandlingService, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.listPaymentPeriods();
    this.makePaymentPeriodAddFormGroup();
    this.makePaymentPeriodEditFormGroup();
  }

  listPaymentPeriods() {
    this.refreshing = true;
    this.paymentPeriodService.getPaymentPeriodListPaginate(this.pageNumber - 1, this.pageSize).subscribe(
      response => {
        this.paymentPeriods = response.content;
        this.pageNumber = response.pageable.page + 1;
        this.pageSize = response.pageable.size;
        this.totalElements = response.total;
        this.refreshing = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponse(errorResponse);
        this.refreshing = false;
      }
    );
  }

  makePaymentPeriodAddFormGroup() {
    this.paymentPeriodAddFormGroup = this.formBuilder.group({
      paymentPeriod: this.formBuilder.group({
        period: new FormControl(this.formatPaymentPeriodDate(new Date()), [Validators.required]),
        requiredHoursWorked: new FormControl('', [Validators.required, Validators.min(0), Validators.max(200)])
      })
    });
  }

  private makePaymentPeriodEditFormGroup() {
    this.paymentPeriodEditFormGroup = this.formBuilder.group({
      paymentPeriod: this.formBuilder.group({
        id: [''],
        periodEdited: new FormControl('', [Validators.required]),
        requiredHoursWorkedEdited: new FormControl('', [Validators.required, Validators.min(0), Validators.max(200)])
      })
    });
  }

  // Submit Add PaymentPeriod From
  onAddNewPaymentPeriod() {
    if (this.paymentPeriodAddFormGroup.invalid) {
      this.paymentPeriodAddFormGroup.markAllAsTouched();
    } else {
      let newPaymentPeriod = new PaymentPeriod(null, this.period.value, this.requiredHoursWorked.value);
      this.paymentPeriodService.createPaymentPeriod(newPaymentPeriod).subscribe(
        (response: PaymentPeriod) => {
          document.getElementById("paymentPeriod-add-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `New payment period '${this.formatPaymentPeriodDate(response.period)}' was created`);
          this.listPaymentPeriods();
        },
        (errorResponse: HttpErrorResponse) => {
          this.errorHandlingService.handleErrorResponseWithButtonClick(errorResponse, "paymentPeriod-add-modal-close");
        }
      );
    }
  }

  preparePaymentPeriodEditFormGroup(paymentPeriod: PaymentPeriod) {
    this.editedPaymentPeriod = this.formatPaymentPeriodDate(paymentPeriod.period);
    this.paymentPeriodEditFormGroup = this.formBuilder.group({
      paymentPeriod: this.formBuilder.group({
        id: [paymentPeriod.id],
        periodEdited: new FormControl(paymentPeriod.period, [Validators.required]),
        requiredHoursWorkedEdited: new FormControl(paymentPeriod.requiredHoursWorked, [Validators.required, Validators.min(0), Validators.max(200)])
      })
    });
  }

  // Submit PaymentPeriod Edit From
  onUpdatePaymentPeriod() {
    if (this.paymentPeriodEditFormGroup.invalid) {
      this.paymentPeriodEditFormGroup.markAllAsTouched();
    } else {
      let updatedPaymentPeriod = new PaymentPeriod(this.id.value, this.periodEdited.value, this.requiredHoursWorkedEdited.value);
      this.paymentPeriodService.updatePaymentPeriod(updatedPaymentPeriod).subscribe(
        response => {
          document.getElementById("paymentPeriod-edit-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The payment period '${this.formatPaymentPeriodDate(updatedPaymentPeriod.period)}' was updated`);
          this.listPaymentPeriods();
        },
        (errorResponse: HttpErrorResponse) => {
          this.errorHandlingService.handleErrorResponseWithButtonClick(errorResponse, "paymentPeriod-edit-modal-close");
        }
      );
    }
  }

  deletePaymentPeriod(id: string, period: Date) {
    let periodText = this.formatPaymentPeriodDate(period);
    if (confirm(`Are you sure want to delete payment period '${periodText}'?`)) {
      this.paymentPeriodService.deletePaymentPeriod(+id).subscribe(
        response => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The payment period '${periodText}' was deleted`);
          this.listPaymentPeriods();
        },
        (errorResponse: HttpErrorResponse) => {
          this.errorHandlingService.handleErrorResponse(errorResponse);
        }
      );
    }
  }

  isAdminOrEconomist(): boolean {
    return (this.authenticationService.isAdmin() || this.authenticationService.isEconomist());
  }

  refresh() {
    this.refreshing = true;
    this.pageNumber = 1;
    this.listPaymentPeriods();
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listPaymentPeriods();
  }

  private formatPaymentPeriodDate(period: Date): string {
    return formatDate(period, 'MMMM yyyy', 'en-US');
  }

  // Getters for paymentPeriodAddFormGroup values
  get period() {
    return this.paymentPeriodAddFormGroup.get('paymentPeriod.period');
  }
  get requiredHoursWorked() {
    return this.paymentPeriodAddFormGroup.get('paymentPeriod.requiredHoursWorked');
  }

  // Getters for paymentPeriodEditFormGroup values
  get id() {
    return this.paymentPeriodEditFormGroup.get('paymentPeriod.id');
  }
  get periodEdited() {
    return this.paymentPeriodEditFormGroup.get('paymentPeriod.periodEdited');
  }
  get requiredHoursWorkedEdited() {
    return this.paymentPeriodEditFormGroup.get('paymentPeriod.requiredHoursWorkedEdited');
  }
}
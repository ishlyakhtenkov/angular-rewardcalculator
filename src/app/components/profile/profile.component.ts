import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/common/user';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/validators/custom-validators';
import { TestDataCheckingService } from 'src/app/services/test-data-checking.service';
import { ErrorHandlingService } from 'src/app/services/error-handling.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: User;

  changePasswordFormGroup: FormGroup;

  constructor(private profileService: ProfileService, private authenticationService: AuthenticationService, 
              private notificationService: NotificationService, private location: Location, private router: Router,
              private formBuilder: FormBuilder, private errorHandlingService: ErrorHandlingService, 
              private testDataCheckingService: TestDataCheckingService) { }

  ngOnInit(): void {
    this.handleUserProfile();
    this.makeChangePasswordFormGroup();
  }

  private handleUserProfile() {
    this.profileService.getProfile().subscribe(
      (response: User) => {
        this.profile = response;
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponse(errorResponse);
      }
    );
  }

  private makeChangePasswordFormGroup() {
    this.changePasswordFormGroup = this.formBuilder.group({
      changedPassword: this.formBuilder.group({
        newPassword: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(32), CustomValidators.notOnlyWhitespace]),
        repeatNewPassword: new FormControl('', [Validators.required])
      }, { validator: this.checkIfMatchingPasswords('newPassword', 'repeatNewPassword') })
    });
  }

  prepareChangePasswordFormGroup() {
    this.changePasswordFormGroup = this.formBuilder.group({
      changedPassword: this.formBuilder.group({
        newPassword: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(32), CustomValidators.notOnlyWhitespace]),
        repeatNewPassword: new FormControl('', [Validators.required])
      }, { validator: this.checkIfMatchingPasswords('newPassword', 'repeatNewPassword') })
    });
  }

  private checkIfMatchingPasswords(passwordKey: string, repeatPasswordKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey];
      let repeatPasswordInput = group.controls[repeatPasswordKey];
      if (!repeatPasswordInput.value) {
        return repeatPasswordInput.setErrors({ required: true });
      }
      if (passwordInput.value !== repeatPasswordInput.value) {
        return repeatPasswordInput.setErrors({ notEquivalent: true });
      }
      else {
        return repeatPasswordInput.setErrors(null);
      }
    }
  }

  onChangePassword(): void {
    if (this.changePasswordFormGroup.invalid) {
      this.changePasswordFormGroup.markAllAsTouched();
    } else {
      if (!this.testDataCheckingService.checkTestUser(+this.profile.id, "Test profile password cannot be changed!")) {
        let newPassword = this.changePasswordFormGroup.get('changedPassword.newPassword').value;
        this.profileService.changePassword(newPassword).subscribe(
          response => {
            document.getElementById("change-password-modal-close").click();
            this.notificationService.sendNotification(NotificationType.SUCCESS, `Password has been changed`);
          },
          (errorResponse: HttpErrorResponse) => {
            this.errorHandlingService.handleErrorResponseWithButtonClick(errorResponse, "change-password-modal-close");
          }
        );
      }
    }
  }

  logOut(): void {
    this.authenticationService.logout();
    this.notificationService.sendNotification(NotificationType.SUCCESS, 'You have been logged out');
    this.router.navigateByUrl("/login");
  }

  back(): void {
    this.location.back()
  }

  // Getters for changePasswordFormGroup values
  get newPassword() {
    return this.changePasswordFormGroup.get('changedPassword.newPassword');
  }
  get repeatNewPassword() {
    return this.changePasswordFormGroup.get('changedPassword.repeatNewPassword');
  }
}
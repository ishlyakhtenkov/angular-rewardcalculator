import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationType } from '../enums/notification-type.enum';
import { AuthenticationService } from './authentication.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor(private notificationService: NotificationService, private authenticationService: AuthenticationService, 
              private router: Router) { }


  handleErrorResponse(errorResponse: HttpErrorResponse): void {
    if (this.authError(errorResponse)) {
      this.authenticationService.logout();
      this.notificationService.sendNotifications(NotificationType.ERROR, errorResponse.error.details);
      this.router.navigateByUrl("/login");
    } else {
      this.notificationService.sendNotifications(NotificationType.ERROR, errorResponse.error.details);
    }
  }

  handleErrorResponseWithButtonClick(errorResponse: HttpErrorResponse, buttonId: string): void {
    if (this.authError(errorResponse)) {
      document.getElementById(buttonId).click();
    }
    this.handleErrorResponse(errorResponse);
  }

  private authError(errorResponse: HttpErrorResponse): boolean {
    return (errorResponse.status == 401 || errorResponse.status == 403);
  }
}
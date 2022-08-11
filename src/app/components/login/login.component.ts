import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/common/user';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  showLoading: boolean;

  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private authenticationService: AuthenticationService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn()) {
      this.navigateByUrlAccordingToTheRole();
    }
  }

  onLogin(email: string, password: string): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.authenticationService.login(email, password).subscribe(
        (response: HttpResponse<User>) => {
          const token = response.headers.get('Authorization-Token');
          this.authenticationService.saveToken(token);
          this.authenticationService.addUserToLocalCache(response.body);
          this.navigateByUrlAccordingToTheRole();
          this.showLoading = false;
          this.notificationService.sendNotification(NotificationType.SUCCESS, `Welcome, ${response.body.name}!`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.sendNotifications(NotificationType.ERROR, errorResponse.error.details);
          this.showLoading = false;
        }
      )
    );
  }

  private navigateByUrlAccordingToTheRole() {
    let url: string;
    if (this.authenticationService.isAdmin()) {
      url = '/users';
    } else if (this.authenticationService.isEconomist()) {
      url = '/departmentrewards';
    } else if (this.authenticationService.isPersonnelOfficer()) {
      url = '/departments';
    } else {
      url = '/employeerewards';
    }
    this.router.navigateByUrl(url);
  }

  loginAsAdmin(): void {
    this.onLogin('admin@gmail.com', 'admin');
  }

  loginAsUser(): void {
    this.onLogin('user@yandex.ru', 'password');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());   
  }
}
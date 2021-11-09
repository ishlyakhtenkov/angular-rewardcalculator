import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Messages } from '../enums/messages.enum';
import { NotificationType } from '../enums/notification-type.enum';
import { AuthenticationService } from '../services/authentication.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private router: Router, private notificationService: NotificationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.isUserLoggedIn();
  }

  private isUserLoggedIn(): boolean {
    if (this.authenticationService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    this.notificationService.sendNotification(NotificationType.ERROR, Messages.NEED_LOGIN);
    return false;
  }
}
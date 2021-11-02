import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NotificationType } from '../enums/notification-type.enum';
import { AuthenticationService } from '../services/authentication.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AdminEconomistDepartmentHeadGuard implements CanActivate {
  
  constructor(private authenticationService: AuthenticationService, private router: Router, private notificationService: NotificationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.isUserAdminOrPersonnelOfficerOrEconomist();
  }

  private isUserAdminOrPersonnelOfficerOrEconomist(): boolean {
    if (this.authenticationService.isLoggedIn()) {
      if (this.authenticationService.isAdmin() || this.authenticationService.isEconomist() || this.authenticationService.isDepartmentHead()) {
        return true;
      } else {
        // this.router.navigateByUrl("/albums");
        this.notificationService.sendNotification(NotificationType.ERROR, 'You do not have enough permissions!');
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      this.notificationService.sendNotification(NotificationType.ERROR, 'You need to login to access this page');
      return false;
    }
  }
}
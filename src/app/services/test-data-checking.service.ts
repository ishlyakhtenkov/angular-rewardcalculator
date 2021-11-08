import { Injectable } from '@angular/core';
import { NotificationType } from '../enums/notification-type.enum';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class TestDataCheckingService {

  constructor(private notificationService: NotificationService) { }

  checkTestUser(userId: number, message: string): boolean {
    if (userId == 100000 || userId == 100001 || userId == 100002 || userId == 100003) {
      this.notificationService.sendNotification(NotificationType.ERROR, message);
      return true;
    }
    return false;
  }
}
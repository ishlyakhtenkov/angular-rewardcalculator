import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NotificationType } from '../enums/notification-type.enum';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private notifier: NotifierService) { }

  private notify(type: NotificationType, message: string) {
    this.notifier.notify(type, message);
  }

  sendNotifications(notificationType: NotificationType, messages: string[]) {
    if (messages) {
      for (let tempMessage of messages)
      this.notify(notificationType, tempMessage);
    } else {
      this.notify(notificationType, 'An error occured. Please try again');
    }
  }

  sendNotification(notificationType: NotificationType, message: string) {
    if (message) {
      this.notify(notificationType, message);
    } else {
      this.notify(notificationType, 'An error occured. Please try again');
    }
  }
}
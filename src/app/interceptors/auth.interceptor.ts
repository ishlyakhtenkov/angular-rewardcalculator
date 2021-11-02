import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  private host = environment.apiUrl;

  constructor(private authenticationService: AuthenticationService) {}

  intercept(httpRequest: HttpRequest<unknown>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
    if (httpRequest.url.includes(`${this.host}/profile/login`)) {
      return httpHandler.handle(httpRequest);
    }
    
    this.authenticationService.loadToken();
    const token = this.authenticationService.getToken();
    if (token) {
      const request = httpRequest.clone({setHeaders: {Authorization: `Bearer ${token}`}});
      return httpHandler.handle(request);  
    } else {
      return httpHandler.handle(httpRequest);
    }
  }
}
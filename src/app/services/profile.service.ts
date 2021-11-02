import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../common/user';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private profileUrl = `${environment.apiUrl}/profile`;

  constructor(private httpClient: HttpClient) { }

  getProfile(): Observable<User>{
    return this.httpClient.get<User>(`${this.profileUrl}`);
  }

  changePassword(newPassword: string): Observable<any> {
    const passwordQueryParam = `?password=${newPassword}`;
    return this.httpClient.patch<any>(`${this.profileUrl}/password${passwordQueryParam}`, {});
  }
}
import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NewUserTo } from '../common/new-user-to';
import { User } from '../common/user';
import { UserTo } from '../common/user-to';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = `${environment.apiUrl}/users`;

  constructor(private httpClient: HttpClient) { }

  getUserList(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.usersUrl);
  }

  searchUsers(keyWord: string): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.usersUrl}/by?keyWord=${keyWord}`);
  }

  createUser(newUserTo: NewUserTo): Observable<User> {
    return this.httpClient.post<User>(this.usersUrl, newUserTo);
  }

  updateUser(userTo: UserTo): Observable<any> {
    return this.httpClient.put<any>(`${this.usersUrl}/${userTo.id}`, userTo);
  }

  deleteUser(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.usersUrl}/${id}`);
  }

  changeUserPassword(id: number, newPassword: string): Observable<any> {
    const passwordQueryParam = `?password=${newPassword}`;
    return this.httpClient.patch<any>(`${this.usersUrl}/${id}/password${passwordQueryParam}`, {});
  }

  changeUserStatus(id: number, status: boolean): Observable<any> {
    const statusQueryParam = `?enabled=${status}`;
    return this.httpClient.patch<any>(`${this.usersUrl}/${id}${statusQueryParam}`, {});
  }
}
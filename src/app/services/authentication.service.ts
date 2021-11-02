import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../common/user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private host = environment.apiUrl;
  private token: string;
  private loggedInUserEmail: string;
  private jwtHelper = new JwtHelperService();

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string): Observable<HttpResponse<User>> {
    const authQueryParams = `?email=${email}&password=${password}`;
    return this.httpClient.post<User>(`${this.host}/profile/login${authQueryParams}`, {}, {observe: 'response'});
  }

  logout(): void {
    this.token = null;
    this.loggedInUserEmail = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  addUserToLocalCache(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserFromLocalCache(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  loadToken(): void {
    this.token = localStorage.getItem('token');
  }

  getToken(): string {
    return this.token;
  }

  isLoggedIn(): boolean {
    this.loadToken();
    if (this.token != null && this.token !== '') {
      if (this.jwtHelper.decodeToken(this.token).sub != null || '') {
        if (!this.jwtHelper.isTokenExpired(this.token)) {
          this.loggedInUserEmail = this.jwtHelper.decodeToken(this.token).sub;
          return true;
        }
      }
      return false;
    } else {
      this.logout();
      return false;
    }
  }

  isAdmin(): boolean {
    if (this.isLoggedIn()) {
      return this.getUserFromLocalCache().roles.includes('ADMIN');
    } else {
      return false;
    }
  }
}
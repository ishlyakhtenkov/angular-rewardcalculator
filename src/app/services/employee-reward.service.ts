import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EmployeeReward } from '../common/employee-reward';
import { EmployeeRewardTo } from '../common/employee-reward-to';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRewardService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private httpClient: HttpClient) { }

  getEmployeeRewardList(departmentRewardId: number): Observable<EmployeeReward[]> {
    return this.httpClient.get<EmployeeReward[]>(`${this.apiUrl}/departmentrewards/${departmentRewardId}/employeerewards`);
  }

  getEmployeeRewardListInPdf(departmentRewardId: number): Observable<any> {
    const httpOptions = {
      'responseType'  : 'arraybuffer' as 'json'
    };
    return this.httpClient.get<any>(`${this.apiUrl}/departmentrewards/${departmentRewardId}/employeerewards/pdf`, httpOptions);
  }

  getEmployeeRewardListInPdfWithApprovingSignature(departmentRewardId: number, approvingPosition: string, approvingName: string): Observable<any> {
    const httpOptions = {
      'responseType'  : 'arraybuffer' as 'json'
    };
    const approvingSignatureQueryParams = `?approvingPosition=${approvingPosition}&approvingName=${approvingName}`;
    return this.httpClient.get<any>(`${this.apiUrl}/departmentrewards/${departmentRewardId}/employeerewards/pdf${approvingSignatureQueryParams}`, httpOptions);
  }

  updateEmployeeReward(employeeRewardTo: EmployeeRewardTo): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}/employeerewards/${employeeRewardTo.id}`, employeeRewardTo);
  }
}
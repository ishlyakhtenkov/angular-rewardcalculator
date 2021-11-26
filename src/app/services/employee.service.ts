import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from '../common/employee';
import { EmployeeTo } from '../common/employee-to';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private httpClient: HttpClient) { }

  getNotFiredEmployeeList(departmentId: number): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.apiUrl}/departments/${departmentId}/employees`);
  }

  getFiredEmployeeList(departmentId: number): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.apiUrl}/departments/${departmentId}/employees/fired`);
  }

  createEmployee(employeeTo: EmployeeTo): Observable<Employee> {
    return this.httpClient.post<Employee>(`${this.apiUrl}/employees`, employeeTo);
  }

  updateEmployee(employeeTo: EmployeeTo): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}/employees/${employeeTo.id}`, employeeTo);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/employees/${id}`);
  }

  changeWorkingStatus(id: number, fired: boolean): Observable<any> {
    const statusQueryParam = `?fired=${fired}`;
    return this.httpClient.patch<any>(`${this.apiUrl}/employees/${id}${statusQueryParam}`, {});
  }
}
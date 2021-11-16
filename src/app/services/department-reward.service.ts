import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DepartmentReward } from '../common/department-reward';
import { DepartmentRewardTo } from '../common/department-reward-to';

@Injectable({
  providedIn: 'root'
})
export class DepartmentRewardService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private httpClient: HttpClient) { }

  getDepartmentRewardList(departmentId: number): Observable<DepartmentReward[]> {
    return this.httpClient.get<DepartmentReward[]>(`${this.apiUrl}/departments/${departmentId}/departmentrewards`);
  }

  getDepartmentRewardListPaginate(departmentId: number, page: number, size: number): Observable<GetResponseDepartmentRewards> {
    const paginateQueryParams = `?page=${page}&size=${size}`;
    return this.httpClient.get<GetResponseDepartmentRewards>(`${this.apiUrl}/departments/${departmentId}/departmentrewards/byPage${paginateQueryParams}`);
  }

  createDepartmentReward(departmentRewardTo: DepartmentRewardTo): Observable<DepartmentReward> {
    return this.httpClient.post<DepartmentReward>(`${this.apiUrl}/departmentrewards`, departmentRewardTo);
  }

  updateDepartmentReward(departmentRewardTo: DepartmentRewardTo): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}/departmentrewards/${departmentRewardTo.id}`, departmentRewardTo);
  }

  deleteDepartmentReward(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/departmentrewards/${id}`);
  }
}

interface GetResponseDepartmentRewards {
  content: DepartmentReward[],
  pageable: {
    page: number,
    size: number
  },
  total: number
}
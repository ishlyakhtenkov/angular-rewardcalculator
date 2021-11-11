import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Position } from '../common/position';
import { PositionTo } from '../common/position-to';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private httpClient: HttpClient) { }

  getPositionList(departmentId: number): Observable<Position[]> {
    return this.httpClient.get<Position[]>(`${this.apiUrl}/departments/${departmentId}/positions`);
  }

  createPosition(positionTo: PositionTo): Observable<Position> {
    return this.httpClient.post<Position>(`${this.apiUrl}/positions`, positionTo);
  }

  updatePosition(positionTo: PositionTo): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}/positions/${positionTo.id}`, positionTo);
  }

  deletePosition(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}/positions/${id}`);
  }
}
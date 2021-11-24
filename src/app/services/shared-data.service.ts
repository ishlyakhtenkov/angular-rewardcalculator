import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Department } from '../common/department';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private selectedDepartmentSource = new BehaviorSubject(null);
  currentSelectedDepartment = this.selectedDepartmentSource.asObservable();

  constructor() { }

  changeSelectedDepartment(selectedDepartment: Department) {
    this.selectedDepartmentSource.next(selectedDepartment)
  }
}
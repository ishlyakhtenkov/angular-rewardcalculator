import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { NotificationModule } from './notification.module';
import { AuthenticationService } from './services/authentication.service';
import { NotificationService } from './services/notification.service';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileService } from './services/profile.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthenticationGuard } from './guards/authentication.guard';
import { HeaderComponent } from './components/header/header.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminPersonnelOfficerEconomistGuard } from './guards/admin-personnel-officer-economist.guard';
import { AdminEconomistDepartmentHeadGuard } from './guards/admin-economist-department-head.guard';
import { AdminDepartmentHeadGuard } from './guards/admin-department-head.guard';
import { UserComponent } from './components/user/user.component';
import { UserService } from './services/user.service';
import { DepartmentService } from './services/department.service';
import { ErrorHandlingService } from './services/error-handling.service';
import { TestDataCheckingService } from './services/test-data-checking.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaymentPeriodService } from './services/payment-period.service';
import { PaymentPeriodComponent } from './components/payment-period/payment-period.component';
import { DepartmentComponent } from './components/department/department.component';
import { PositionComponent } from './components/position/position.component';
import { PositionService } from './services/position.service';
import { EmployeeService } from './services/employee.service';
import { EmployeeComponent } from './components/employee/employee.component';
import { DepartmentRewardComponent } from './components/department-reward/department-reward.component';
import { DepartmentRewardService } from './services/department-reward.service';

const routes: Routes = [
  {path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'users', component: UserComponent, canActivate: [AdminGuard]},
  {path: 'paymentperiods', component: PaymentPeriodComponent, canActivate: [AuthenticationGuard]},
  {path: 'departments', component: DepartmentComponent, canActivate: [AdminPersonnelOfficerEconomistGuard]},
  {path: 'positions', component: PositionComponent, canActivate: [AuthenticationGuard]},
  {path: 'employees', component: EmployeeComponent, canActivate: [AuthenticationGuard]},
  {path: 'departmentrewards', component: DepartmentRewardComponent, canActivate: [AdminEconomistDepartmentHeadGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', redirectTo: '/login', pathMatch: 'full'}
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    HeaderComponent,
    UserComponent,
    PaymentPeriodComponent,
    DepartmentComponent,
    PositionComponent,
    EmployeeComponent,
    DepartmentRewardComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NotificationModule,
    NgbModule,
    FormsModule,
    NgSelectModule
  ],
  providers: [AuthenticationService, NotificationService, ProfileService, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    AuthenticationGuard, AdminGuard, AdminPersonnelOfficerEconomistGuard, AdminEconomistDepartmentHeadGuard, AdminDepartmentHeadGuard, 
    UserService, DepartmentService, ErrorHandlingService, TestDataCheckingService, PaymentPeriodService, PositionService, 
    EmployeeService, DepartmentRewardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
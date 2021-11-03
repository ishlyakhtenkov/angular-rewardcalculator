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

const routes: Routes = [
  {path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard]},
  {path: 'login', component: LoginComponent},
  // {path: 'departments', component: DepartmentComponent, canActivate: [AdminGuard]},
  // {path: 'employees', component: EmployeeComponent, canActivate: [AuthenticationGuard]},
  // {path: 'albums', component: AlbumComponent},
  {path: 'users', component: UserComponent, canActivate: [AdminGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', redirectTo: '/login', pathMatch: 'full'}
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    HeaderComponent,
    UserComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NotificationModule,
    NgbModule,
    FormsModule
  ],
  providers: [AuthenticationService, NotificationService, ProfileService, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    AuthenticationGuard, AdminGuard, AdminPersonnelOfficerEconomistGuard, AdminEconomistDepartmentHeadGuard, AdminDepartmentHeadGuard, 
    UserService, DepartmentService, ErrorHandlingService, TestDataCheckingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
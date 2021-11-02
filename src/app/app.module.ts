import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { NotificationModule } from './notification.module';
import { AuthenticationService } from './services/authentication.service';
import { NotificationService } from './services/notification.service';

const routes: Routes = [
  // {path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard]},
  {path: 'login', component: LoginComponent},
  // {path: 'departments', component: DepartmentComponent, canActivate: [AdminGuard]},
  // {path: 'employees', component: EmployeeComponent, canActivate: [AuthenticationGuard]},
  // {path: 'albums', component: AlbumComponent},
  // {path: 'users', component: UserComponent, canActivate: [AdminGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', redirectTo: '/login', pathMatch: 'full'}
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NotificationModule,
    NgbModule,
    FormsModule
  ],
  providers: [AuthenticationService, NotificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
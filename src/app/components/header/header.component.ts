import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('navbarToggler') navbarToggler:ElementRef;

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
  }

  isUserLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authenticationService.isAdmin();
  }

  isAdminOrPersonnelOfficerOrEconomist(): boolean {
    return (this.authenticationService.isAdmin() || this.authenticationService.isPersonnelOfficer() || this.authenticationService.isEconomist());
  }

  isAdminOrEconomistOrDepartmentHead(): boolean {
    return (this.authenticationService.isAdmin() || this.authenticationService.isEconomist() || this.authenticationService.isDepartmentHead());
  }

  isAdminOrDepartmentHead(): boolean {
    return (this.authenticationService.isAdmin() || this.authenticationService.isDepartmentHead());
  }

  isLoginPage(): boolean {
   return this.router.url.includes('/login');
  }

  routeToLogin(): void {
    this.router.navigate([`/login`]);
  }

  navBarTogglerIsVisible() {
    return this.navbarToggler.nativeElement.offsetParent !== null;
  }

  collapseNav() {
    if (this.navBarTogglerIsVisible()) {
      this.navbarToggler.nativeElement.click();
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../app-security/services/authentication.service';
import { User } from '../../app-users/models/user.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  rollsCanAcces = ['ROLE_TECHNOLOGIST', 'ROLE_CMO', 'ROLE_CTO', 'ROLE_ACOUNTER', 'ROLE_ECONOMIST', 'ROLE_STOREKEEPER'];
  productsCanAccess = ['ROLE_TECHNOLOGIST', 'ROLE_MANAGER', 'ROLE_CMO', 'ROLE_CTO', 'ROLE_ACOUNTER', 'ROLE_ECONOMIST', 'ROLE_STOREKEEPER'];
  ordersCanAccess = ['ROLE_MANAGER', 'ROLE_CMO', 'ROLE_ECONOMIST'];
  standardsCanAccess = ['ROLE_TECHNOLOGIST', 'ROLE_CMO', 'ROLE_CTO', 'ROLE_ECONOMIST'];
  productPlansCanAccess = ['ROLE_TECHNOLOGIST', 'ROLE_CMO', 'ROLE_CTO', 'ROLE_ECONOMIST', 'ROLE_MANAGER'];
  rollPlansCanAccess = ['ROLE_TECHNOLOGIST', 'ROLE_CMO', 'ROLE_CTO', 'ROLE_ECONOMIST'];
  machinePlansCanAccess = ['ROLE_TECHNOLOGIST', 'ROLE_CMO', 'ROLE_CTO', 'ROLE_ECONOMIST'];
  usersCanAccess = ['ROLE_ADMIN'];

  title = 'app';
  isCollapsed = false;

  currentUser: User;

  constructor(
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  onLogout() {
    this.authService.logout();
  }

}

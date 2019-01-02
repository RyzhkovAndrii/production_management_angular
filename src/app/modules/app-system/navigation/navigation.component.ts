import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../app-security/services/authentication.service';
import { User } from '../../app-users/models/user.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  rollsCanAccess = ['ROLE_TECHNOLOGIST', 'ROLE_CMO', 'ROLE_CTO', 'ROLE_ACCOUNTANT', 'ROLE_ECONOMIST',
    'ROLE_STOREKEEPER', 'ROLE_FULL_ACCESS'];
  productsCanAccess = ['ROLE_TECHNOLOGIST', 'ROLE_MANAGER', 'ROLE_CMO', 'ROLE_CTO', 'ROLE_ACCOUNTANT',
    'ROLE_ECONOMIST', 'ROLE_STOREKEEPER', 'ROLE_FULL_ACCESS'];
  ordersCanAccess = ['ROLE_MANAGER', 'ROLE_CMO', 'ROLE_ECONOMIST', 'ROLE_FULL_ACCESS'];
  standardsCanAccess = ['ROLE_TECHNOLOGIST', 'ROLE_CMO', 'ROLE_CTO', 'ROLE_ECONOMIST', 'ROLE_FULL_ACCESS'];
  productPlansCanAccess = ['ROLE_TECHNOLOGIST', 'ROLE_CMO', 'ROLE_CTO', 'ROLE_ECONOMIST', 'ROLE_MANAGER', 'ROLE_FULL_ACCESS'];
  rollPlansCanAccess = ['ROLE_TECHNOLOGIST', 'ROLE_CMO', 'ROLE_CTO', 'ROLE_ECONOMIST', 'ROLE_FULL_ACCESS'];
  machinePlansCanAccess = ['ROLE_TECHNOLOGIST', 'ROLE_CMO', 'ROLE_CTO', 'ROLE_ECONOMIST', 'ROLE_FULL_ACCESS'];
  // todo check roles
  rollsReportCanAccess = ['ROLE_TECHNOLOGIST', 'ROLE_CMO', 'ROLE_CTO', 'ROLE_ECONOMIST', 'ROLE_FULL_ACCESS'];
  productsReportCanAccess = ['ROLE_TECHNOLOGIST', 'ROLE_CMO', 'ROLE_CTO', 'ROLE_ECONOMIST', 'ROLE_FULL_ACCESS'];
  // standardsReportCanAccess = ['ROLE_TECHNOLOGIST', 'ROLE_CMO', 'ROLE_CTO', 'ROLE_ECONOMIST', 'ROLE_FULL_ACCESS'];
  usersCanAccess = ['ROLE_ADMIN', 'ROLE_FULL_ACCESS'];

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

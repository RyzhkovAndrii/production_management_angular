import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../app-security/services/authentication.service';
import { User } from '../../app-users/models/user.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

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

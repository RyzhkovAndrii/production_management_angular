import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from 'ngx-modal-dialog';
import { Observable } from 'rxjs/Observable';

import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { AppModalService } from '../../../app-shared/services/app-modal.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit {

  userList$: Observable<User[]>;

  currentUser = null;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.fetchUserData();
  }

  private fetchUserData() {
    this.userList$ = this.userService.getAll();
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
  }

}

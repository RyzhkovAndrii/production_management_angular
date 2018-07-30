import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from 'ngx-modal-dialog';

import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { AppModalService } from '../../../app-shared/services/app-modal.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit {

  userList: User[];

  currentUser = null;

  constructor(
    private userService: UserService,
    private viewRef: ViewContainerRef,
    private ngxModalDialogService: ModalDialogService,
    private appModalService: AppModalService
  ) { }

  ngOnInit() {
    this.fetchUserData();
  }

  private fetchUserData() {
    this.userService
      .getAll()
      .subscribe(
        response => this.userList = response,
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
    )
  }

  setCurrentUser(i: number) {
    this.currentUser = i === -1 ? null : this.userList[i];
  }

}

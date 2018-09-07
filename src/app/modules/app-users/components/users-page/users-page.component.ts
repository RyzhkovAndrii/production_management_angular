import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit {

  userList$: Observable<User[]>;

  private currentUserSource = new BehaviorSubject<User>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.fetchUserData();
  }

  private fetchUserData() {
    this.userList$ = this.userService.getAll();
  }

  setCurrentUser(user: User = null) {
    this.currentUserSource.next(user);
  }

}

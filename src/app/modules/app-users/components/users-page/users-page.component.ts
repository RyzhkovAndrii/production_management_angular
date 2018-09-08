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

  private usersSource = new BehaviorSubject<User[]>([]);
  users$ = this.usersSource.asObservable();
  users: User[];

  private currentUserSource = new BehaviorSubject<User>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.fetchUserData();
  }

  private fetchUserData() {
    this.userService.getAll().subscribe(resp => {
      this.users = resp;
      this.usersSource.next(resp);
    });
  }

  setCurrentUser(user: User = null) {
    this.currentUserSource.next(user);
  }

  userFormSubmit(user: User) {
    const i = this.users.findIndex(u => u.username === user.username);
    const obs$ = user.id
      ? this.userService.update(user, user.id)
      : this.userService.save(user);
    obs$.subscribe(userResp => (i === -1) ? this.users.push(userResp) : this.users[i] = userResp);
    this.usersSource.next(this.users);
  }

  userRemove(user: User) {
    this.userService
      .delete(user.id)
      .subscribe(() => {
        const i = this.users.findIndex(u => u.username === user.username);
        this.users.splice(i, 1);
        this.usersSource.next(this.users);
      });
  }

}

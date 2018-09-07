import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { User } from '../../../models/user.model';
import { Role } from '../../../../app-security/enums/role.enum';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  @Output() userSubmit = new EventEmitter<User>();

  @Input() user$: Observable<User>;
  @Input() users: User[];
  user: User;
  roles = Role;

  userForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.initForm();
    this.user$.subscribe(user => {
      this.user = user;
      this.updateForm();
    });
  }

  onSubmit() {
    const user = this.user ? this.user : new User();
    const { username, firstName, lastName, roles } = this.userForm.value;
    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;
    user.roles = roles;
    this.userSubmit.emit(user);
  }

  onClear() {
    this.user ? this.updateForm() : this.clearForm();
  }

  private initForm() {
    this.userForm = new FormGroup({
      'username': new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z0-9]*'), this.uniqueNameValidator.bind(this)]),
      'firstName': new FormControl(null, [Validators.required, Validators.pattern('[А-Яа-яёЁ]*')]),
      'lastName': new FormControl(null, [Validators.required, Validators.pattern('[А-Яа-яёЁ]*')]),
      'roles': new FormControl(null, [Validators.required])
    });
  }

  private updateForm() {
    const username = this.user ? this.user.username : null;
    const firstName = this.user ? this.user.firstName : null;
    const lastName = this.user ? this.user.lastName : null;
    const roles = this.user ? this.user.roles : null;
    this.userForm.get('username').setValue(username);
    this.userForm.get('firstName').setValue(firstName);
    this.userForm.get('lastName').setValue(lastName);
    this.userForm.get('roles').setValue(roles);
  }

  private clearForm() {
    this.userForm.reset();
  }

  private uniqueNameValidator(control: AbstractControl) {
    const currentId = this.user ? this.user.id : -1;
    const username = control.value;
    for (let i = 0; i < this.users.length; i++) {
      const user = this.users[i];
      if ((String(username).toUpperCase() === String(user.username).toUpperCase()) && (currentId !== user.id)) {
        return { 'uniqueUsername': true };
      }
    }
    return null;
  }

  // private onlyLetterValidator(control: AbstractControl) {
  //   const str = control.value;
  //     if ((String(username).toUpperCase() === String(user.username).toUpperCase()) && (currentId !== user.id)) {
  //       return { 'uniqueUsername': true };
  //     }
  //   }
  //   return null;
  // }

}

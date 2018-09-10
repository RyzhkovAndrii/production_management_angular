import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';
import { AppModalService } from '../../../app-shared/services/app-modal.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent {

  readonly MIN_PASS_LENGTH = 6;
  readonly MAX_PASS_LENGTH = 30;

  showValidErr = false;
  showUserNotFound = false;
  showPassIncorrect = false;
  showPassNotMatch = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private appModalService: AppModalService
  ) { }

  form: FormGroup = new FormGroup({
    'username': new FormControl(null, [Validators.required]),
    'password': new FormControl(null, [Validators.required]),
    'newPassword': new FormControl(null, [
      Validators.required,
      Validators.minLength(this.MIN_PASS_LENGTH),
      Validators.maxLength(this.MAX_PASS_LENGTH)
    ]),
    'confirmPassword': new FormControl(null, [Validators.required]),
  });

  onSubmit() {
    if (!this.form.valid) {
      this.showValidErr = true;
      return;
    }
    if (!this.isNewPasswordMatch()) {
      this.showPassNotMatch = true;
      return;
    }
    const { username, password, newPassword } = this.form.value;
    this.authService
      .login(username, password)
      .subscribe(
        token => {
          this.authService.setToken(token);
          this.authService
            .changeCurrentUserPassword(newPassword)
            .subscribe(() => {
              this.authService.logout();
              this.router.navigate(['/auth/login'], { queryParams: { passChange: true } });
            });
        },
        err => this.toggleErrMessages(err)
      );
  }

  private toggleErrMessages(messages: string[]) {
    switch (messages[1]) {
      case 'User does not exist': {
        this.showUserNotFound = true;
        break;
      }
      case 'Password is incorrect': {
        this.showPassIncorrect = true;
        break;
      }
      default: {
        this.appModalService.openHttpErrorWindow(messages);
      }
    }
  }

  resetFormShowErr() {
    this.showPassNotMatch = false;
    this.showUserNotFound = false;
    this.showPassIncorrect = false;
  }

  onCancel() {
    this.router.navigate(['/auth/login']);
  }

  private isNewPasswordMatch() {
    const { newPassword, confirmPassword } = this.form.value;
    return  newPassword.localeCompare(confirmPassword) === 0;
  }

}

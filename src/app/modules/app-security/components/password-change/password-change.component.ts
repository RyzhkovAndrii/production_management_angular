import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthenticationService } from '../../services/authentication.service';

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
    private router: Router
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
    this.checkNewPasswordMatch();
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
        (err: HttpErrorResponse) => {
          this.toggleErrMessages(JSON.parse(err.error).message);
        }
      );
  }

  private toggleErrMessages(message: string) {
    switch (message) {
      case 'User does not exist': {
        this.showUserNotFound = true;
        break;
      }
      case 'Password is incorrect': {
        this.showPassIncorrect = true;
        break;
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

  private checkNewPasswordMatch() {
    const { newPassword, confirmPassword } = this.form.value;
    this.showPassNotMatch = newPassword.localeCompare(confirmPassword) !== 0;
  }

}

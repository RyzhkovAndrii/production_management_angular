import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { HttpErrorResponse } from '../../../../../../node_modules/@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() login = new EventEmitter<any>();

  showValidErr = false;
  showUserNotFound = false;
  showPassIncorrect = false;

  constructor(
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
  }

  form: FormGroup = new FormGroup({
    'username': new FormControl(null, [Validators.required]),
    'password': new FormControl(null, [Validators.required]),
    'remember': new FormControl(false)
  });

  submit() {
    if (!this.form.valid) {
      this.showValidErr = true;
      return;
    }
    const { username, password } = this.form.value;
    this.authService
      .login(username, password)
      .subscribe(
        token => {
          this.authService.setToken(token);
          this.authService.recieveCurrentUserInfo()
            .subscribe(
              user => {
                this.authService.setCurrentUser(user);
                this.login.emit();
              }
            )
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
    this.showUserNotFound = false;
    this.showPassIncorrect = false;
  }

}

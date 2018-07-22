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

  message?: String;

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
                this.hideAllert();
                this.login.emit();
              }
            )
        },
        (err: HttpErrorResponse) => {
          this.message = this.convertErrorMessage(JSON.parse(err.error).message);
        }
      );
  }

  private convertErrorMessage(message: string): string {
    switch(message) {
      case 'User is not specified': {
        return 'Имя пользователя не указано'
      }
      case 'User does not exist': {
        return 'Имя пользователя не найдено'
      }
      case 'Password is incorrect': {
        return 'Пароль неверен'
      }
      default: {
        return message;
      }
    }
  }

  hideAllert() {
    this.message = null;
  }

}

import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';
import { AppModalService } from '../../../app-shared/services/app-modal.service';

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

  form: FormGroup = new FormGroup({
    'username': new FormControl(null, [Validators.required]),
    'password': new FormControl(null, [Validators.required]),
    'remember': new FormControl(true)
  });

  message: string;
  msgClass: string;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private appModalService: AppModalService
  ) { }

  ngOnInit() {
    this.checkRouteMessage();
  }

  submit() {
    this.authService.logout();
    if (!this.form.valid) {
      this.showValidErr = true;
      return;
    }
    const { username, password, remember } = this.form.value;
    const storage = remember ? localStorage : sessionStorage;
    this.authService
      .login(username, password)
      .subscribe(
        token => {
          this.authService.setStorage(storage);
          this.authService.setToken(token);
          this.authService.recieveCurrentUserInfo()
            .subscribe(user => {
              this.authService.setCurrentUser(user);
              this.router.navigate(['/']);
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
        this.appModalService.openHttpError(messages);
      }
    }
  }

  private checkRouteMessage() {
    this.message = null;
    this.route.queryParams.subscribe(params => {
      if (params['authError']) {
        this.message = 'Вы не авторизованы';
        this.msgClass = 'alert-danger';
      } else if (params['passChange']) {
        this.message = 'Пароль успешно изменен';
        this.msgClass = 'alert-success';
      }
    });
  }

  resetFormShowErr() {
    this.showUserNotFound = false;
    this.showPassIncorrect = false;
  }

  goToPasswordChange() {
    this.router.navigate(['/auth/password/']);
  }

}

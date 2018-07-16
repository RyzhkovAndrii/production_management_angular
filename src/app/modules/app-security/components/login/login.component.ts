import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() login = new EventEmitter<any>();

  constructor(
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
  }

  form: FormGroup = new FormGroup({
    'username': new FormControl(null, [Validators.required]),
    'password': new FormControl(null, [Validators.required])
  });

  submit() {
    const {username, password} = this.form.value;
    this.authService.login(username, password);
    console.log(this.authService.getCurrentUser());
    this.login.emit();
  }

}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SecurityRoutingModule } from './security-routing.module';
import { CanAccessDirective } from './directives/can-access.directive';
import { LoginComponent } from './components/login/login.component';
import { PasswordChangeComponent } from './components/password-change/password-change.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SecurityRoutingModule
    ],
    declarations: [
        CanAccessDirective,
        LoginComponent,
        PasswordChangeComponent,
        AccessDeniedComponent
    ],
    exports: [
        CanAccessDirective
    ],
    providers: [],
    entryComponents: []
})
export class SecurityModule { }

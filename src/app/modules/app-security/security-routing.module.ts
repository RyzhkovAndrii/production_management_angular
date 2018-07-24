import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "./components/login/login.component";
import { PasswordChangeComponent } from "./components/password-change/password-change.component";

const securityRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'password',
        component: PasswordChangeComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(securityRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class SecurityRoutingModule { }
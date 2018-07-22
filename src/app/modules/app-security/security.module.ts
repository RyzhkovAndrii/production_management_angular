import { CommonModule } from "../../../../node_modules/@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SecurityRoutingModule } from "./security-routing.module";
import { CanAccessDirective } from "./directives/can-access.directive";
import { LoginComponent } from './components/login/login.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SecurityRoutingModule
    ],
    declarations: [
        CanAccessDirective,
        LoginComponent
    ],
    exports: [
        CanAccessDirective
    ],
    providers: [],
    entryComponents: []
})
export class SecurityModule { }
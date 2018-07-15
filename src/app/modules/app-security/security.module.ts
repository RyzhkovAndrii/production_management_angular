import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CanAccessDirective } from "./directives/can-access.directive";
import { LoginComponent } from './components/login/login.component';
import { SecurityRoutingModule } from "./security-routing.module";

@NgModule({
    imports: [
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
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { ModalDialogModule } from "ngx-modal-dialog";
import { NgDatepickerModule } from 'ng2-datepicker';

import { AppSharedModule } from "../app-shared/app-shared.module";
import { UsersRoutingModule } from "./users-router.module";
import { UserService } from "./services/user.service";
import { UsersPageComponent } from "./components/users-page/users-page.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        ModalDialogModule.forRoot(),
        AppSharedModule,
        NgDatepickerModule,
        UsersRoutingModule
    ],
    declarations: [
        UsersPageComponent
    ],
    providers: [
        UserService
    ],
    entryComponents: []
})
export class UsersModule { }
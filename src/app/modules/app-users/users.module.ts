import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { ModalDialogModule } from "ngx-modal-dialog";

import { AppSharedModule } from "../app-shared/app-shared.module";
import { UsersRoutingModule } from "./users-router.module";
import { UserService } from "./services/user.service";
import { UsersPageComponent } from "./components/users-page/users-page.component";
import { UserModuleUrlService } from "./services/user-module-url.serivce";
import { LastModificationComponent } from "./components/last-modification/last-modification.component";
import { ModificationService } from "./services/modification.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        ModalDialogModule.forRoot(),
        AppSharedModule,
        UsersRoutingModule
    ],
    declarations: [
        UsersPageComponent,
        LastModificationComponent   
    ],
    providers: [
        UserService,
        UserModuleUrlService,
        ModificationService
    ],
    entryComponents: []
})
export class UsersModule { }
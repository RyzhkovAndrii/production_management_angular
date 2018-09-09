import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalDialogModule } from 'ngx-modal-dialog';

import { UsersRoutingModule } from './users-router.module';
import { UserService } from './services/user.service';
import { UsersPageComponent } from './components/users-page/users-page.component';
import { UserCardComponent } from './components/users-page/user-card/user-card.component';
import { UserFormComponent } from './components/users-page/user-form/user-form.component';
import { UserModuleUrlService } from './services/user-module-url.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        ModalDialogModule.forRoot(),
        UsersRoutingModule
    ],
    declarations: [
        UsersPageComponent,
        UserCardComponent,
        UserFormComponent
    ],
    providers: [
        UserService,
        UserModuleUrlService
    ],
    exports: [],
    entryComponents: []
})
export class UsersModule { }

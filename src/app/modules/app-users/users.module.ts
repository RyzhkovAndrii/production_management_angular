import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalDialogModule } from 'ngx-modal-dialog';

import { UsersRoutingModule } from './users-router.module';
import { UserService } from './services/user.service';
import { UsersPageComponent } from './components/users-page/users-page.component';
import { UserModuleUrlService } from './services/user-module-url.serivce';
import { UserCardComponent } from './components/users-page/user-card/user-card.component';

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
        UserCardComponent
    ],
    providers: [
        UserService,
        UserModuleUrlService
    ],
    exports: [],
    entryComponents: []
})
export class UsersModule { }

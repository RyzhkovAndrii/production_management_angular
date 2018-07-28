import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  HttpErrorModalComponent
} from './components/http-error-modal/http-error-modal.component';
import {
  AppModalService
} from './services/app-modal.service';
import {
  SimpleConfirmModalComponent
} from './components/simple-confirm-modal/simple-confirm-modal.component';
import {
  ExponentPipe
} from './pipes/exponent.pipe';
import {
  EmptyPipe
} from './pipes/empty.pipe';
import {
  MomentPipe
} from './pipes/moment.pipe';
import {
  CheckSelectComponent
} from './components/check-select/check-select.component';
import {
  NgSelectModule
} from '@ng-select/ng-select';
import {
  FormsModule
} from '@angular/forms';
import {
  TextConfirmModalComponent
} from './components/text-confirm-modal/text-confirm-modal.component';
import {
  LastModificationComponent
} from './components/last-modification/last-modification.component';
import {
  ModificationService
} from './services/modification.service';
import {
  SharedModuleUrlService
} from './services/shared-module-url.serivce';
import {
  UsersModule
} from '../app-users/users.module';

@NgModule({
  declarations: [
    HttpErrorModalComponent,
    SimpleConfirmModalComponent,
    ExponentPipe,
    EmptyPipe,
    MomentPipe,
    CheckSelectComponent,
    TextConfirmModalComponent,
    LastModificationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    UsersModule
  ],
  exports: [
    HttpErrorModalComponent,
    SimpleConfirmModalComponent,
    TextConfirmModalComponent,
    ExponentPipe,
    EmptyPipe,
    MomentPipe,
    CheckSelectComponent,
    LastModificationComponent
  ],
  entryComponents: [
    HttpErrorModalComponent,
    SimpleConfirmModalComponent,
    TextConfirmModalComponent
  ],
  providers: [
    SharedModuleUrlService,
    ModificationService
  ]
})
export class AppSharedModule { }

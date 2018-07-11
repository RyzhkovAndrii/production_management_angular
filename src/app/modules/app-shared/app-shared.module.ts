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

@NgModule({
  declarations: [
    HttpErrorModalComponent,
    SimpleConfirmModalComponent,
    ExponentPipe,
    EmptyPipe,
    MomentPipe,
    CheckSelectComponent,
    TextConfirmModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule
  ],
  exports: [
    HttpErrorModalComponent,
    SimpleConfirmModalComponent,
    TextConfirmModalComponent,
    ExponentPipe,
    EmptyPipe,
    MomentPipe,
    CheckSelectComponent
  ],
  entryComponents: [
    HttpErrorModalComponent,
    SimpleConfirmModalComponent,
    TextConfirmModalComponent
  ]
})
export class AppSharedModule {}

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

@NgModule({
  declarations: [
    HttpErrorModalComponent,
    SimpleConfirmModalComponent,
    ExponentPipe,
    EmptyPipe,
    MomentPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HttpErrorModalComponent,
    SimpleConfirmModalComponent,
    ExponentPipe,
    EmptyPipe,
    MomentPipe
  ],
  entryComponents: [
    HttpErrorModalComponent,
    SimpleConfirmModalComponent
  ]
})
export class AppSharedModule {}

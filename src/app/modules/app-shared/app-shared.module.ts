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

@NgModule({
  declarations: [
    HttpErrorModalComponent,
    SimpleConfirmModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HttpErrorModalComponent,
    SimpleConfirmModalComponent
  ],
  entryComponents: [
    HttpErrorModalComponent,
    SimpleConfirmModalComponent
  ]
})
export class AppSharedModule {}

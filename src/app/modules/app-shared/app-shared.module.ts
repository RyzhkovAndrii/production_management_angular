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

@NgModule({
  declarations: [
    HttpErrorModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HttpErrorModalComponent
  ],
  entryComponents: [
    HttpErrorModalComponent
  ]
})
export class AppSharedModule {}

import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  FormsModule
} from '@angular/forms';
import {
  NgSelectModule
} from '@ng-select/ng-select';

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
   TextConfirmModalComponent
} from './components/text-confirm-modal/text-confirm-modal.component';
import {
  CircleComponent
} from './components/circle/circle.component';

@NgModule({
  declarations: [
    HttpErrorModalComponent,
    SimpleConfirmModalComponent,
    ExponentPipe,
    EmptyPipe,
    MomentPipe,
    CheckSelectComponent,
    TextConfirmModalComponent,
    CircleComponent
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
    CheckSelectComponent,
    CircleComponent
  ],
  entryComponents: [
    HttpErrorModalComponent,
    SimpleConfirmModalComponent,
    TextConfirmModalComponent
  ]
})
export class AppSharedModule {}

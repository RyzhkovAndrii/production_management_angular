import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  ModalDialogModule
} from 'ngx-modal-dialog';
import {
  ContextMenuModule
} from 'ngx-contextmenu';

import {
  RollsPlanPageComponentComponent
} from './components/rolls-plan-page-component/rolls-plan-page-component.component';
import {
  RollsPlanRoutingModule
} from './rolls-plan-routing.module';
import {
  AppSharedModule
} from '../app-shared/app-shared.module';
import {
  SecurityModule
} from '../app-security/security.module';

@NgModule({
  imports: [
    CommonModule,
    RollsPlanRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalDialogModule.forRoot(),
    AppSharedModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true
    }),
    SecurityModule
  ],
  declarations: [RollsPlanPageComponentComponent]
})
export class RollsPlanModule {}

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
  ContextMenuModule
} from 'ngx-contextmenu';
import {
  ModalDialogModule
} from 'ngx-modal-dialog';

import {
  StandardsPageComponent
} from './components/standards-page/standards-page.component';
import {
  StandardsRouting
} from './standards-routing.module';
import {
  StandardsUrlsService
} from './services/standards-urls.service';
import {
  StandardsService
} from './services/standards.service';
import {
  AppSharedModule
} from '../app-shared/app-shared.module';
import {
  StandardModalComponent
} from './components/standard-modal/standard-modal.component';

@NgModule({
  imports: [
    CommonModule,
    StandardsRouting,
    FormsModule,
    ReactiveFormsModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true
    }),
    ModalDialogModule.forRoot(),
    AppSharedModule
  ],
  declarations: [
    StandardsPageComponent,
    StandardModalComponent
  ],
  providers: [
    StandardsUrlsService,
    StandardsService
  ],
  entryComponents: [
    StandardModalComponent
  ]
})
export class StandardsModule {}

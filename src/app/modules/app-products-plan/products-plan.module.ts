import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  ModalDialogModule
} from 'ngx-modal-dialog';
import {
  ContextMenuModule
} from 'ngx-contextmenu';

import {
  ProductsPlanPageComponent
} from './components/products-plan-page/products-plan-page.component';
import {
  ProductsPlanRoutingModule
} from './products-plan-routing.module';
import {
  AppSharedModule
} from '../app-shared/app-shared.module';

@NgModule({
  imports: [
    CommonModule,
    ProductsPlanRoutingModule,
    ModalDialogModule.forRoot(),
    AppSharedModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true
    }),

  ],
  declarations: [ProductsPlanPageComponent]
})
export class ProductsPlanModule {}

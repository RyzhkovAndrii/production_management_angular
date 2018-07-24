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
    AppSharedModule
  ],
  declarations: [ProductsPlanPageComponent]
})
export class ProductsPlanModule {}

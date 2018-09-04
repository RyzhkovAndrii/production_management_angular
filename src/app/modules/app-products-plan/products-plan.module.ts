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
import {
  ProductPlanOperationSelectModalComponent
} from './components/modals/product-plan-operation-select-modal/product-plan-operation-select-modal.component';

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
  declarations: [ProductsPlanPageComponent, ProductPlanOperationSelectModalComponent]
})
export class ProductsPlanModule {}

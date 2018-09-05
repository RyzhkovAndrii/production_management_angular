import {
  CommonModule
} from '@angular/common';
import {
  NgModule
} from '@angular/core';
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
  AppSharedModule
} from '../app-shared/app-shared.module';
import {
  ProductPlanOperationSelectModalComponent
} from './components/modals/product-plan-operation-select-modal/product-plan-operation-select-modal.component';
import {
  ProductsPlanPageComponent
} from './components/products-plan-page/products-plan-page.component';
import {
  ProductsPlanRoutingModule
} from './products-plan-routing.module';


@NgModule({
  imports: [
    CommonModule,
    ProductsPlanRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalDialogModule.forRoot(),
    AppSharedModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true
    }),

  ],
  declarations: [ProductsPlanPageComponent, ProductPlanOperationSelectModalComponent],
  entryComponents: [ProductPlanOperationSelectModalComponent]
})
export class ProductsPlanModule {}

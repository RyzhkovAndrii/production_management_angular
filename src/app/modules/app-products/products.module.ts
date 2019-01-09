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
  ColorPickerModule
} from 'ngx-color-picker';
import {
  NgSelectModule
} from '@ng-select/ng-select';
import {
  ContextMenuModule
} from 'ngx-contextmenu';
import {
  ModalDialogModule
} from 'ngx-modal-dialog';
import {
  NgbModule
} from '@ng-bootstrap/ng-bootstrap';

import {
  AppSharedModule
} from '../app-shared/app-shared.module';
import {
  ProductsPageComponent
} from './components/products-page/products-page.component';
import {
  ProductsRoutingModule
} from './products-routing.module';
import {
  ProductTypeModalComponent
} from './components/product-type-modal/product-type-modal.component';
import {
  ProductOperationModalComponent
} from './components/product-operation-modal/product-operation-modal.component';
import {
  SecurityModule
} from '../app-security/security.module';
import {
  ProductOperationSelectModalComponent
} from './components/product-operation-select-modal/product-operation-select-modal.component';


@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    ProductsRoutingModule,
    ColorPickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true
    }),
    ModalDialogModule.forRoot(),
    AppSharedModule,
    SecurityModule
  ],
  declarations: [
    ProductsPageComponent, ProductTypeModalComponent, ProductOperationModalComponent, ProductOperationSelectModalComponent
  ],
  entryComponents: [
    ProductTypeModalComponent,
    ProductOperationModalComponent,
    ProductOperationSelectModalComponent
  ]
})
export class ProductsModule {}

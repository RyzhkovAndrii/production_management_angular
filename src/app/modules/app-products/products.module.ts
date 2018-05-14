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
  AppSharedModule
} from '../app-shared/app-shared.module';
import {
  ProductsPageComponent
} from './components/products-page/products-page.component';
import {
  ProductsRoutingModule
} from './products-routing.module';
import {
  ProductsUrlsService
} from './services/products-urls.service';
import {
  ProductsService
} from './services/products.service';
import {
  ProductTypeModalComponent
} from './components/product-type-modal/product-type-modal.component';


@NgModule({
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ColorPickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true
    }),
    ModalDialogModule.forRoot(),
    AppSharedModule
  ],
  declarations: [ProductsPageComponent, ProductTypeModalComponent],
  providers: [
    ProductsUrlsService,
    ProductsService
  ],
  entryComponents: [
    ProductTypeModalComponent
  ]
})
export class ProductsModule {}

import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  ProductsPageComponent
} from './components/products-page/products-page.component';
import {
  ProductsRoutingModule
} from './products-routing.module';
import {
  ProductsUrlsService
} from './services/products-urls.service';

@NgModule({
  imports: [
    CommonModule,
    ProductsRoutingModule
  ],
  declarations: [ProductsPageComponent],
  providers: [
    ProductsUrlsService
  ]
})
export class ProductsModule {}

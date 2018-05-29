import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  ProductsPageComponent
} from './components/products-page/products-page.component';

const productsRoutes: Routes = [{
  path: '',
  component: ProductsPageComponent
}];

@NgModule({
  imports: [
    RouterModule.forChild(productsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProductsRoutingModule {}

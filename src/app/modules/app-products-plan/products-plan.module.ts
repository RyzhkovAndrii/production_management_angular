import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  ProductsPlanPageComponent
} from './components/products-plan-page/products-plan-page.component';
import {
  ProductsPlanRoutingModule
} from './products-plan-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ProductsPlanRoutingModule
  ],
  declarations: [ProductsPlanPageComponent]
})
export class ProductsPlanModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsReportPageComponent } from './products-report-page/products-report-page.component';



const ProductsReportRoutes: Routes = [{
    path: '',
    component: ProductsReportPageComponent
}];

@NgModule({
    imports: [
        RouterModule.forChild(ProductsReportRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ProductsReportRoutingModule { }


import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrdersPageComponent } from "./components/orders-page/orders-page.component";

const ordersRoutes: Routes = [{
    path: '',
    component: OrdersPageComponent
}];

@NgModule({
    imports: [
        RouterModule.forChild(ordersRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class OrdersRoutingModule { }
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { ContextMenuModule } from "ngx-contextmenu";
import { ModalDialogModule } from "ngx-modal-dialog";
import { AppSharedModule } from "../app-shared/app-shared.module";
import { NgDatepickerModule } from 'ng2-datepicker';

import { OrderModuleUrlService } from "./services/order-module-url.service";
import { OrdersService } from "./services/orders.service";
import { ProductsUrlsService } from "../app-products/services/products-urls.service";
import { ClientsService } from "./services/client.service";
import { ProductsService } from "../app-products/services/products.service";
import { OrderItemService } from "./services/order-item.service";
import { OrdersPageComponent } from "./components/orders-page/orders-page.component";
import { OrdersRoutingModule } from "./orders-routing.module";
import { OrderCreateComponent } from './components/orders-page/order-create/order-create.component';
import { ClientListComponent } from './components/orders-page/client-list/client-list.component';
import { ClientDelConfirmComponent } from './components/orders-page/client-list/client-del-confirm/client-del-confirm.component';
import { OrderEditComponent } from './components/orders-page/order-edit/order-edit.component';
import { OrderComponent } from "./components/orders-page/order/order.component";
import { OrderLeftoverProductComponent } from "./components/orders-page/order-leftover-product/order-leftover-product.component";
import { OrderDelConfirmComponent } from "./components/orders-page/order/order-del-confirm/order-del-confirm.component";
import { OrderDeliveredShowComponent } from './components/orders-page/order-delivered-show/order-delivered-show.component';
import { OrderDeliveryConfirmComponent } from "./components/orders-page/order/order-delivery-confirm/order-delivery-confirm.component";

@NgModule({
    imports: [
        CommonModule,
        OrdersRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        ContextMenuModule.forRoot({
            useBootstrap4: true
        }),
        ModalDialogModule.forRoot(),
        AppSharedModule,
        NgDatepickerModule
    ],
    declarations: [
        OrdersPageComponent,
        OrderComponent,
        OrderLeftoverProductComponent,
        OrderDelConfirmComponent,
        OrderCreateComponent,
        ClientListComponent,
        ClientDelConfirmComponent,
        OrderEditComponent,
        OrderDeliveryConfirmComponent,
        OrderDeliveredShowComponent,
    ],
    providers: [
        OrdersService,
        ClientsService,
        OrderItemService,
        ProductsService,
        ProductsUrlsService,
        OrderModuleUrlService
    ],
    entryComponents: []
})
export class OrdersModule { }
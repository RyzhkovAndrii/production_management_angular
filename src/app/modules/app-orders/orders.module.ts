import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ColorPickerModule } from "ngx-color-picker";
import { NgSelectModule } from "@ng-select/ng-select";
import { ContextMenuModule } from "ngx-contextmenu";
import { ModalDialogModule } from "ngx-modal-dialog";
import { AppSharedModule } from "../app-shared/app-shared.module";
import { OrdersRoutingModule } from "./orders-routing.module";
import { OrdersPageComponent } from "./components/orders-page/orders-page.component";
import { OrdersService } from "./services/orders.service";
import { ClientsService } from "./services/client.service";
import { OrderComponent } from './components/order/order.component';
import { OrderItemService } from "./services/order-item.service";
import { ProductsService } from "../app-products/services/products.service";
import { ProductsUrlsService } from "../app-products/services/products-urls.service";
import { OrderLeftoverProductComponent } from './components/order-leftover-product/order-leftover-product.component';
import { OrderModuleUrlService } from "./services/order-module-url.service";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { OrderModalComponent } from './components/order-modal/order-modal.component';
import { OrderDelConfirmComponent } from './components/order/order-del-confirm/order-del-confirm.component';
import { OrderCreateComponent } from './components/orders-page/order-create/order-create.component';
import { ClientListComponent } from './components/orders-page/client-list/client-list.component';
import { ClientDelConfirmComponent } from './components/orders-page/client-list/client-del-confirm/client-del-confirm.component';

@NgModule({
    imports: [
        CommonModule,
        OrdersRoutingModule,
        ColorPickerModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        ContextMenuModule.forRoot({
            useBootstrap4: true
        }),
        ModalDialogModule.forRoot(),
        AppSharedModule,
        NgbModule
    ],
    declarations: [
        OrdersPageComponent,
        OrderComponent,
        OrderLeftoverProductComponent,
        OrderModalComponent,
        OrderDelConfirmComponent,
        OrderCreateComponent,
        ClientListComponent,
        ClientDelConfirmComponent,
    ],
    providers: [
        OrdersService,
        ClientsService,
        OrderItemService,
        ProductsService,
        ProductsUrlsService,
        OrderModuleUrlService
    ],
    entryComponents: [
        OrderModalComponent
    ]
})
export class OrdersModule { }
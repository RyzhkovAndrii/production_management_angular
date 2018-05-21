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
        AppSharedModule
    ],
    declarations: [
        OrdersPageComponent
    ],
    providers: [],
    entryComponents: []
})
export class OrdersModule { }
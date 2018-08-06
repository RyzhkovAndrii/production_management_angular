import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { ContextMenuModule } from "ngx-contextmenu";
import { ModalDialogModule } from "ngx-modal-dialog";
import { NgDatepickerModule } from 'ng2-datepicker';

import { AppSharedModule } from "../app-shared/app-shared.module";
import { MachinesRoutingModule } from "./machines-routing.module";
import { MachineComponent } from "./machine/machine.component";
import { MachineService } from "./services/machine.service";
import { MachinesPageComponent } from "./machines-page/machines-page.component";
import { ProductsService } from "../app-products/services/products.service";
import { MachineItemComponent } from './machine/machine-item/machine-item.component';
import { MachineModuleUrlService } from "./services/machine-module-url.service";

@NgModule({
    imports: [
        CommonModule,
        MachinesRoutingModule,
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
        MachineComponent,
        MachinesPageComponent,
        MachineItemComponent
    ],
    providers: [
        MachineService,
        ProductsService,
        MachineModuleUrlService
    ],
    entryComponents: []
})
export class MachinesModule { }
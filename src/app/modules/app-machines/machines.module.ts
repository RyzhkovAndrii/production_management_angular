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
import { MachineTableComponent } from "./machine/machine-table/machine-table.component";
import { MachineItemFormComponent } from "./machine/machine-item-form/machine-item-form.component";
import { DailyPlanTableComponent } from './machines-page/daily-plan-table/daily-plan-table.component';

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
        MachineItemComponent,
        MachineTableComponent,
        MachineItemFormComponent,
        DailyPlanTableComponent
    ],
    providers: [
        MachineService,
        ProductsService,
        MachineModuleUrlService
    ],
    entryComponents: []
})
export class MachinesModule { }
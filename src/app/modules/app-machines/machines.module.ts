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
import { MachinePlanService } from "./services/machine-plan.service";
import { MachinesPageComponent } from "./machines-page/machines-page.component";
import { ProductsService } from "../app-products/services/products.service";
import { MachinePlanComponent } from './machine/machine-plan/machine-plan.component';
import { MachineModuleUrlService } from "./services/machine-module-url.service";
import { MachineTableComponent } from "./machine/machine-table/machine-table.component";
import { MachinePlanFormComponent } from "./machine/machine-plan-form/machine-plan-form.component";
import { DailyPlanTableComponent } from './machines-page/daily-plan-table/daily-plan-table.component';
import { DailyProductPlanService } from "./services/daily-product-plan.service";
import { MachinePlanItemService } from "./services/machine-plan-item.service";

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
        MachinePlanComponent,
        MachineTableComponent,
        MachinePlanFormComponent,
        DailyPlanTableComponent
    ],
    providers: [
        MachinePlanService,
        MachinePlanItemService,
        ProductsService,
        MachineModuleUrlService,
        DailyProductPlanService
    ],
    entryComponents: []
})
export class MachinesModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContextMenuModule } from 'ngx-contextmenu';
import { ModalDialogModule } from 'ngx-modal-dialog';
import { NgDatepickerModule } from 'ng2-datepicker';

import { AppSharedModule } from '../app-shared/app-shared.module';
import { MachinesRoutingModule } from './machines-routing.module';
import { MachineComponent } from './machine/machine.component';
import { MachinePlanService } from './services/machine-plan.service';
import { MachinesPageComponent } from './machines-page/machines-page.component';
import { ProductsService } from '../app-products/services/products.service';
import { MachinePlanComponent } from './machine/machine-plan/machine-plan.component';
import { MachineModuleUrlService } from './services/machine-module-url.service';
import { MachineTableComponent } from './machine/machine-table/machine-table.component';
import { MachinePlanFormComponent } from './machine/machine-plan-form/machine-plan-form.component';
import { DailyPlanTableComponent } from './machines-page/daily-plan-table/daily-plan-table.component';
import { MachineModuleCasheService } from './services/machine-module-cashe.service';
import { MachinePlanItemService } from './services/machine-plan-item.service';
import { MachineModuleStoreDataService } from './services/machine-module-store-data.service';
import { AppHttpErrorService } from '../app-shared/services/app-http-error.service';
import { ProductSelectComponent } from './machine/machine-plan-form/product-select/product-select.component';
import { MachinePlanFormService } from './services/machine-plan-form.service';
import { ProductNameComponent } from './machines-page/product-name/product-name.component';
import { TimeLineComponent } from './machines-page/time-line/time-line.component';
import { RollNameComponent } from './machines-page/roll-name/roll-name.component';

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
        DailyPlanTableComponent,
        ProductSelectComponent,
        ProductNameComponent,
        TimeLineComponent,
        RollNameComponent
    ],
    providers: [
        MachinePlanService,
        MachinePlanItemService,
        MachinePlanFormService,
        ProductsService,
        MachineModuleUrlService,
        MachineModuleCasheService,
        MachineModuleStoreDataService,
        AppHttpErrorService
    ],
    entryComponents: []
})
export class MachinesModule { }

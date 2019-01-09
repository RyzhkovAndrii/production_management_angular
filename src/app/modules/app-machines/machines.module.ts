import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContextMenuModule } from 'ngx-contextmenu';
import { ModalDialogModule } from 'ngx-modal-dialog';
import { NgDatepickerModule } from 'ng2-datepicker';

import { MachinesRoutingModule } from './machines-routing.module';
import { AppSharedModule } from '../app-shared/app-shared.module';
import { MachineComponent } from './machines-page/machine/machine.component';
import { MachinesPageComponent } from './machines-page/machines-page.component';
import { MachinePlanComponent } from './machines-page/machine/machine-plan/machine-plan.component';
import { MachineTableComponent } from './machines-page/machine/machine-table/machine-table.component';
import { MachinePlanFormComponent } from './machines-page/machine/machine-plan-form/machine-plan-form.component';
import { DailyPlanTableComponent } from './machines-page/daily-plan-table/daily-plan-table.component';
import { ProductSelectComponent } from './machines-page/machine/machine-plan-form/product-select/product-select.component';
import { ProductNameComponent } from './machines-page/product-name/product-name.component';
import { TimeLineComponent } from './machines-page/time-line/time-line.component';
import { RollNameComponent } from './machines-page/roll-name/roll-name.component';
import { RollTableComponent } from './machines-page/machine/machine-plan-form/roll-table/roll-table.component';
import { MachinePlanService } from './services/machine-plan.service';
import { MachinePlanItemService } from './services/machine-plan-item.service';
import { ProductsService } from '../app-products/services/products.service';
import { MachineModuleUrlService } from './services/machine-module-url.service';
import { MachineModuleCasheService } from './services/machine-module-cashe.service';
import { MachineModuleStoreDataService } from './services/machine-module-store-data.service';
import { SecurityModule } from '../app-security/security.module';

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
        NgDatepickerModule,
        SecurityModule
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
        RollNameComponent,
        RollTableComponent
    ],
    providers: [
        MachinePlanService,
        MachinePlanItemService,
        ProductsService,
        MachineModuleUrlService,
        MachineModuleCasheService,
        MachineModuleStoreDataService
    ],
    entryComponents: []
})
export class MachinesModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SecurityModule } from '../app-security/security.module';
import { StandardsReportPageComponent } from './standards-report-page/standards-report-page.component';
import { AppSharedModule } from '../app-shared/app-shared.module';
import { StandardsReportModuleUrlService } from './services/standards-report-module-url.service';
import { StandardsReportService } from './services/standards-report.service';
import { StandardsReportRoutingModule } from './standards-report-routing.module';
import { MachinesModule } from '../app-machines/machines.module';

@NgModule({
    imports: [
        CommonModule,
        StandardsReportRoutingModule,
        SecurityModule,
        AppSharedModule,
        ReactiveFormsModule,
        MachinesModule
    ],
    declarations: [
        StandardsReportPageComponent
    ],
    providers: [
        StandardsReportModuleUrlService,
        StandardsReportService
    ]
})
export class StandardsReportModule { }

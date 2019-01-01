import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { RollsReportRoutingModule } from './rolls-report-routing.module';
import { SecurityModule } from '../app-security/security.module';
import { RollsReportPageComponent } from './rolls-report-page/rolls-report-page.component';
import { AppSharedModule } from '../app-shared/app-shared.module';
import { RollsReportModuleUrlService } from './services/rolls-report-module-url.service';
import { RollsReportService } from './services/rolls-report.service';

@NgModule({
    imports: [
        CommonModule,
        RollsReportRoutingModule,
        SecurityModule,
        AppSharedModule,
        ReactiveFormsModule
    ],
    declarations: [
        RollsReportPageComponent
    ],
    providers: [
        RollsReportModuleUrlService,
        RollsReportService
    ]
})
export class RollsReportModule { }

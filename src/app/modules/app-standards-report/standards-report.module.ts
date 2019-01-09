import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SecurityModule } from '../app-security/security.module';
import { StandardsReportPageComponent } from './standards-report-page/standards-report-page.component';
import { AppSharedModule } from '../app-shared/app-shared.module';
import { StandardsReportModuleUrlService } from './services/standards-report-module-url.service';
import { StandardsReportService } from './services/standards-report.service';
import { StandardsReportRoutingModule } from './standards-report-routing.module';
import { RollNameComponent } from './standards-report-page/roll-name/roll-name.component';
import { ProductNameComponent } from './standards-report-page/product-name/product-name.component';

@NgModule({
    imports: [
        CommonModule,
        StandardsReportRoutingModule,
        SecurityModule,
        AppSharedModule,
        ReactiveFormsModule
    ],
    declarations: [
        StandardsReportPageComponent,
        RollNameComponent,
        ProductNameComponent
    ],
    providers: [
        StandardsReportModuleUrlService,
        StandardsReportService
    ]
})
export class StandardsReportModule { }

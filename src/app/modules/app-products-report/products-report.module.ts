import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SecurityModule } from '../app-security/security.module';
import { AppSharedModule } from '../app-shared/app-shared.module';
import { ProductsReportPageComponent } from './products-report-page/products-report-page.component';
import { ProductsReportRoutingModule } from './products-report-routing.module';
import { ProductsReportModuleUrlService } from './services/products-report-module-url.service';
import { ProductsReportService } from './services/products-report.service';

@NgModule({
    imports: [
        CommonModule,
        ProductsReportRoutingModule,
        SecurityModule,
        AppSharedModule,
        ReactiveFormsModule
    ],
    declarations: [
        ProductsReportPageComponent
    ],
    providers: [
        ProductsReportModuleUrlService,
        ProductsReportService
    ]
})
export class ProductsReportModule { }

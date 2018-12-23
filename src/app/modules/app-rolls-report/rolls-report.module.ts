import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RollsReportRoutingModule } from './rolls-report-routing.module';
import { SecurityModule } from '../app-security/security.module';
import { RollsReportPageComponent } from './rolls-report-page/rolls-report-page.component';

@NgModule({
    imports: [
        CommonModule,
        RollsReportRoutingModule,
        SecurityModule
    ],
    declarations: [
        RollsReportPageComponent
    ]
})
export class RollsReportModule { }

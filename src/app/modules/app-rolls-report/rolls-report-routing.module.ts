import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RollsReportPageComponent } from './rolls-report-page/rolls-report-page.component';


const rollsReportRoutes: Routes = [{
    path: '',
    component: RollsReportPageComponent
}];

@NgModule({
    imports: [
        RouterModule.forChild(rollsReportRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class RollsReportRoutingModule { }


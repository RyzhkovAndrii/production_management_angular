import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StandardsReportPageComponent } from './standards-report-page/standards-report-page.component';



const standardsReportRoutes: Routes = [{
    path: '',
    component: StandardsReportPageComponent
}];

@NgModule({
    imports: [
        RouterModule.forChild(standardsReportRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class StandardsReportRoutingModule { }


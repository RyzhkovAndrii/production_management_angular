import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MachinesPageComponent } from "./machines-page/machines-page.component";

const machinesRoutes: Routes = [{
    path: '',
    component: MachinesPageComponent
}];

@NgModule({
    imports: [
        RouterModule.forChild(machinesRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class MachinesRoutingModule { }
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const machinesRoutes: Routes = [{
    
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
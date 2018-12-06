import {
  NgModule
} from "@angular/core";
import {
  Routes,
  RouterModule
} from "@angular/router";

import {
  RollsPlanPageComponentComponent
} from "./components/rolls-plan-page-component/rolls-plan-page-component.component";

const rollsPlanRoutes: Routes = [{
  path: '',
  component: RollsPlanPageComponentComponent
}]

@NgModule({
  imports: [RouterModule.forChild(rollsPlanRoutes)],
  exports: [RouterModule]
})
export class RollsPlanRoutingModule {}

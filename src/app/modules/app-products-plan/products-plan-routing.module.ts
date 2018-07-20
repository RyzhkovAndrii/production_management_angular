import {
  NgModule
} from "@angular/core";
import {
  Routes,
  RouterModule
} from "@angular/router";
import {
  ProductsPlanPageComponent
} from "./components/products-plan-page/products-plan-page.component";

const productPlanRoutes: Routes = [{
  path: '',
  component: ProductsPlanPageComponent
}]

@NgModule({
  imports: [RouterModule.forChild(productPlanRoutes)],
  exports: [RouterModule]
})
export class ProductsPlanRoutingModule {}

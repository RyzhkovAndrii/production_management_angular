import {
  NgModule
} from "@angular/core";
import {
  Routes, RouterModule
} from "@angular/router";
import {
  StandardsPageComponent
} from "./components/standards-page/standards-page.component";

const standardsRoutes: Routes = [{
  path: '',
  component: StandardsPageComponent
}]

@NgModule({
    imports: [RouterModule.forChild(standardsRoutes)],
    exports: [RouterModule]
})
export class StandardsRouting {}

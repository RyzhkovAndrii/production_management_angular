import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  RollsPageComponent
} from './components/rolls-page/rolls-page.component';
import {
  RollOperationsPageComponent
} from './components/roll-operations-page/roll-operations-page.component'

const rollsRoutes: Routes = [{
    path: '',
    component: RollsPageComponent
  },
  {
    path: 'operations',
    component: RollOperationsPageComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(rollsRoutes)],
  exports: [RouterModule]
})
export class RollsRouting {}

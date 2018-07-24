import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule,
  PreloadAllModules
} from '@angular/router';
import {
  HomePageComponent
} from '../../components/home-page/home-page.component';
import {
  RoleGuard
} from '../app-security/guards/role.guard';

const appRoutes: Routes = [{
  path: '',
  component: HomePageComponent
},
{
  path: 'auth',
  loadChildren: '../app-security/security.module#SecurityModule'
},
{
  path: 'rolls',
  loadChildren: '../app-rolls/rolls.module#RollsModule',
  canActivate: [RoleGuard],
  data: {
    roles: ['ROLE_TECHNOLOGIST', 'ROLE_CMO', 'ROLE_CTO',
      'ROLE_ACOUNTER', 'ROLE_ECONOMIST', 'ROLE_STOREKEEPER']
  }
},
{
  path: 'products',
  loadChildren: '../app-products/products.module#ProductsModule',
  canActivate: [RoleGuard],
  data: {
    roles: ['ROLE_TECHNOLOGIST', 'ROLE_MANAGER', 'ROLE_CMO', 'ROLE_CTO',
      'ROLE_ACOUNTER', 'ROLE_ECONOMIST', 'ROLE_STOREKEEPER']
  }
},
{
  path: 'orders',
  loadChildren: '../app-orders/orders.module#OrdersModule',
  canActivate: [RoleGuard],
  data: {
    roles: ['ROLE_MANAGER', 'ROLE_CMO', 'ROLE_ECONOMIST']
  }
},
{
  path: 'standards',
  loadChildren: '../app-standards/standards.module#StandardsModule',
  canActivate: [RoleGuard],
  data: {
    roles: ['ROLE_TECHNOLOGIST', 'ROLE_CMO', 'ROLE_CTO', 'ROLE_ECONOMIST']
  }
},
{
  path: 'products-plan',
  loadChildren: '../app-products-plan/products-plan.module#ProductsPlanModule',
  canActivate: [RoleGuard],
  data: {
    roles: ['ROLE_TECHNOLOGIST', 'ROLE_CMO', 'ROLE_CTO', 'ROLE_ECONOMIST', 'ROLE_MANAGER']
  }
},
{
  path: '**', // todo check without spring redirect
  redirectTo: ''
}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }

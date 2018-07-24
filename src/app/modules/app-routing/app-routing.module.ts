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
    loadChildren: '../app-rolls/rolls.module#RollsModule'
  },
  {
    path: 'products',
    loadChildren: '../app-products/products.module#ProductsModule'
  },
  {
    path: 'orders',
    loadChildren: '../app-orders/orders.module#OrdersModule'
  },
  {
    path: 'standards',
    loadChildren: '../app-standards/standards.module#StandardsModule'
  },
  {
    path: 'products-plan',
    loadChildren: '../app-products-plan/products-plan.module#ProductsPlanModule'
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
export class AppRoutingModule {}

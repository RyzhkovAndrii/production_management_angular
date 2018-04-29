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
    path: 'rolls',
    loadChildren: '../app-rolls/rolls.module#RollsModule'
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

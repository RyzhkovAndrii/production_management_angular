import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from '../components/home-page/home-page.component';
import { RollsPageComponent } from '../components/rolls-page/rolls-page.component';

const appRoutes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'rolls', component: RollsPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
declarations: []
})
export class AppRoutingModule { }

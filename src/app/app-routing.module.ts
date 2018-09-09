import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './modules/app-security/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: './modules/app-system/system.module#SystemModule',
    canActivate: [AuthGuard]
  },
  { path: 'auth', loadChildren: './modules/app-security/security.module#SecurityModule' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

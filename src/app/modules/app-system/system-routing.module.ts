import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleGuard } from '../app-security/guards/role.guard';
import { HomePageComponent } from './home-page/home-page.component';
import { SystemComponent } from './system.component';

const routes: Routes = [
    {
        path: '', component: SystemComponent, children: [
            {
                path: '',
                component: HomePageComponent
            },
            {
                path: 'rolls',
                loadChildren: '../app-rolls/rolls.module#RollsModule',
                canActivate: [RoleGuard],
                canActivateChild: [RoleGuard],
                data: {
                    roles: ['ROLE_TECHNOLOGIST', 'ROLE_CMO', 'ROLE_CTO',
                        'ROLE_ACCOUNTANT', 'ROLE_ECONOMIST', 'ROLE_STOREKEEPER']
                }
            },
            {
                path: 'products',
                loadChildren: '../app-products/products.module#ProductsModule',
                canActivate: [RoleGuard],
                canActivateChild: [RoleGuard],
                data: {
                    roles: ['ROLE_TECHNOLOGIST', 'ROLE_MANAGER', 'ROLE_CMO', 'ROLE_CTO',
                        'ROLE_ACCOUNTANT', 'ROLE_ECONOMIST', 'ROLE_STOREKEEPER']
                }
            },
            {
                path: 'orders',
                loadChildren: '../app-orders/orders.module#OrdersModule',
                canActivate: [RoleGuard],
                canActivateChild: [RoleGuard],
                data: {
                    roles: ['ROLE_MANAGER', 'ROLE_CMO', 'ROLE_ECONOMIST']
                }
            },
            {
                path: 'standards',
                loadChildren: '../app-standards/standards.module#StandardsModule',
                canActivate: [RoleGuard],
                canActivateChild: [RoleGuard],
                data: {
                    roles: ['ROLE_TECHNOLOGIST', 'ROLE_CMO', 'ROLE_CTO', 'ROLE_ECONOMIST']
                }
            },
            {
                path: 'products-plan',
                loadChildren: '../app-products-plan/products-plan.module#ProductsPlanModule',
                canActivate: [RoleGuard],
                canActivateChild: [RoleGuard],
                data: {
                    roles: ['ROLE_TECHNOLOGIST', 'ROLE_CMO', 'ROLE_CTO', 'ROLE_ECONOMIST', 'ROLE_MANAGER']
                }
            },
            // todo add module
            // {
            //     path: 'rolls-plan',
            //     loadChildren: '../app-rolls-plan/rolls-plan.module#RollsPlanModule',
            //     canActivate: [RoleGuard],
            //     canActivateChild: [RoleGuard],
            //     data: {
            //         roles: ['ROLE_TECHNOLOGIST', 'ROLE_CMO', 'ROLE_CTO', 'ROLE_ECONOMIST']
            //     }
            // },
            {
                path: 'machines',
                loadChildren: '../app-machines/machines.module#MachinesModule',
                canActivate: [RoleGuard],
                canActivateChild: [RoleGuard],
                data: {
                    roles: ['ROLE_TECHNOLOGIST', 'ROLE_CMO', 'ROLE_CTO', 'ROLE_ECONOMIST']
                }
            },
            {
                path: 'users',
                loadChildren: '../app-users/users.module#UsersModule',
                canActivate: [RoleGuard],
                canActivateChild: [RoleGuard],
                data: {
                    roles: ['ROLE_ADMIN']
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SystemRoutingModule { }

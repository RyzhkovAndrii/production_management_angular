import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemComponent } from './system.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NavigationComponent } from './navigation/navigation.component';
import { SystemRoutingModule } from './system-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        SystemRoutingModule,
        NgbModule.forRoot()
    ],
    declarations: [
        HomePageComponent,
        NavigationComponent,
        SystemComponent
    ]
})
export class SystemModule { }

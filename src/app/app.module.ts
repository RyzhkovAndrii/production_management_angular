import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HotTableModule } from '@handsontable/angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AppComponent } from './components/app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HomePageComponent } from './components/home-page/home-page.component';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    HotTableModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

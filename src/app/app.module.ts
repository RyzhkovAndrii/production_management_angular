import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AppComponent } from './components/app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HomePageComponent } from './components/home-page/home-page.component';
import { RollsPageComponent } from './components/rolls-page/rolls-page.component';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    RollsPageComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

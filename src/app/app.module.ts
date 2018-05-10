import {
  BrowserModule
} from '@angular/platform-browser';
import {
  NgModule
} from '@angular/core';
import {
  NgbModule
} from '@ng-bootstrap/ng-bootstrap';
import {
  HttpClientModule
} from '@angular/common/http';


import {
  AppComponent
} from './components/app.component';
import {
  AppRoutingModule
} from './modules/app-routing/app-routing.module';
import {
  HomePageComponent
} from './components/home-page/home-page.component';
import {
  RestDetailsService
} from './services/rest-details-service';
import {
  AppModalService
} from './modules/app-shared/services/app-modal.service';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    RestDetailsService,
    AppModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

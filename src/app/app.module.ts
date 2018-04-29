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
  UrlService
} from './services/url.service';
import {
  RollsService
} from './modules/app-rolls/services/rolls.service';
import {
  HttpErrorModalComponent
} from './components/http-error-modal/http-error-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    HttpErrorModalComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    UrlService,
    RollsService
  ],
  entryComponents: [
    HttpErrorModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

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
import {
  ProductsService
} from './modules/app-products/services/products.service';
import {
  ProductsUrlsService
} from './modules/app-products/services/products-urls.service';
import {
  RollsService
} from './modules/app-rolls/services/rolls.service';
import {
  RollsUrlService
} from './modules/app-rolls/services/rolls-url.service';
import {
  StandardsUrlsService
} from './modules/app-standards/services/standards-urls.service';
import {
  StandardsService
} from './modules/app-standards/services/standards.service';
import {
  ProductsPlanUrlsService
} from './modules/app-products-plan/services/products-plan-urls.service';
import {
  ProductsPlanService
} from './modules/app-products-plan/services/products-plan.service';
import {
   SecurityModule
} from './modules/app-security/security.module';
import {
   AuthorizationService
} from './modules/app-security/services/authorization.service';
import {
   AuthenticationService
} from './modules/app-security/services/authentication.service';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    SecurityModule
  ],
  providers: [
    RestDetailsService,
    AppModalService,
    ProductsUrlsService,
    ProductsService,
    RollsUrlService,
    RollsService,
    StandardsUrlsService,
    StandardsService,
    ProductsPlanUrlsService,
    ProductsPlanService,
    AuthorizationService,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

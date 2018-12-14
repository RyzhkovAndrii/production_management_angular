import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { RestDetailsService } from './services/rest-details-service';
import { AppModalService } from './modules/app-shared/services/app-modal.service';
import { ProductsService } from './modules/app-products/services/products.service';
import { ProductsUrlsService } from './modules/app-products/services/products-urls.service';
import { RollsService } from './modules/app-rolls/services/rolls.service';
import { RollsUrlService } from './modules/app-rolls/services/rolls-url.service';
import { StandardsUrlsService } from './modules/app-standards/services/standards-urls.service';
import { StandardsService } from './modules/app-standards/services/standards.service';
import { ProductsPlanUrlsService } from './modules/app-products-plan/services/products-plan-urls.service';
import { ProductsPlanService } from './modules/app-products-plan/services/products-plan.service';
import { SecurityModule } from './modules/app-security/security.module';
import { AuthorizationService } from './modules/app-security/services/authorization.service';
import { AuthenticationService } from './modules/app-security/services/authentication.service';
import { SecurityModuleUrlService } from './modules/app-security/services/security-module-url.service';
import { TokenInterceptor } from './modules/app-security/interceptors/token.interceptor';
import { RoleGuard } from './modules/app-security/guards/role.guard';
import { AuthGuard } from './modules/app-security/guards/auth.guard';
import { SystemModule } from './modules/app-system/system.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RollsPlanUrlsService } from './modules/app-rolls-plan/services/rolls-plan-urls.service';
import { RollsPlanService } from './modules/app-rolls-plan/services/rolls-plan.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    SecurityModule,
    SystemModule
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
    RollsPlanUrlsService,
    RollsPlanService,
    AuthorizationService,
    AuthenticationService,
    SecurityModuleUrlService,
    RoleGuard,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

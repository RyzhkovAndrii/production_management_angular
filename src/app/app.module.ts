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
} from './app-routing/app-routing.module';
import {
  HomePageComponent
} from './components/home-page/home-page.component';
import {
  RollsPageComponent
} from './components/rolls-page/rolls-page.component';
import {
  UrlService
} from './services/url.service';
import {
  RollsService
} from './services/rolls.service';
import {
  RollTypeModalComponent
} from './components/rolls-page/roll-type-modal/roll-type-modal.component';
import {
  ColorPickerModule
} from 'ngx-color-picker';
import {
  ReactiveFormsModule
} from '@angular/forms';
import {
  RollOperationModalComponent
} from './components/rolls-page/roll-operation-modal/roll-operation-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    RollsPageComponent,
    RollTypeModalComponent,
    RollOperationModalComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ColorPickerModule,
    ReactiveFormsModule
  ],
  providers: [
    UrlService,
    RollsService
  ],
  entryComponents: [
    RollTypeModalComponent,
    RollOperationModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

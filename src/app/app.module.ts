import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './components/app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HomePageComponent } from './components/home-page/home-page.component';
import { RollsPageComponent } from './components/rolls-page/rolls-page.component';
import { UrlService } from './services/url.service';
import { RollsService } from './services/rolls.service';
import { AddRollTypeModalComponent } from './components/rolls-page/add-roll-type-modal/add-roll-type-modal.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    RollsPageComponent,
    AddRollTypeModalComponent
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
  entryComponents: [AddRollTypeModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

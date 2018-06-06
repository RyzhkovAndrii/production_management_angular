import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  StandardsPageComponent
} from './components/standards-page/standards-page.component';
import {
  StandardsRouting
} from './standards-routing.module';
import {
  StandardsUrlsService
} from './services/standards-urls.service';
import {
  StandardsService
} from './services/standards.service';

@NgModule({
  imports: [
    CommonModule,
    StandardsRouting
  ],
  declarations: [StandardsPageComponent],
  providers: [
    StandardsUrlsService,
    StandardsService
  ]
})
export class StandardsModule {}

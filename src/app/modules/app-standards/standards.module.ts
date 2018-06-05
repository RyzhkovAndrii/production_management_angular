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

@NgModule({
  imports: [
    CommonModule,
    StandardsRouting
  ],
  declarations: [StandardsPageComponent]
})
export class StandardsModule {}

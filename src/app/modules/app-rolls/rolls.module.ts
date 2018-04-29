import {
  NgModule
} from "@angular/core";
import {
  CommonModule
} from "@angular/common";
import {
  ReactiveFormsModule
} from "@angular/forms";
import {
  ColorPickerModule
} from 'ngx-color-picker';
import {
  NgbModule
} from "@ng-bootstrap/ng-bootstrap";

import {
  RollsPageComponent
} from "./components/rolls-page/rolls-page.component";
import {
  RollTypeModalComponent
} from "./components/roll-type-modal/roll-type-modal.component";
import {
  RollOperationModalComponent
} from "./components/roll-operation-modal/roll-operation-modal.component";
import {
  RollsRouting
} from "./rolls-routing.module";
import {
  RollsService
} from "./services/rolls.service";
import {
  RollsUrlService
} from "./services/rolls-url.service";

@NgModule({
  declarations: [RollsPageComponent,
    RollTypeModalComponent,
    RollOperationModalComponent
  ],
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    RollsRouting,
    ColorPickerModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    RollTypeModalComponent,
    RollOperationModalComponent
  ],
  providers: [
    RollsService,
    RollsUrlService
  ]
})

export class RollsModule {}

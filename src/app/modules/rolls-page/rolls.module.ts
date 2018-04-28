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
  RollsPageComponent
} from "./rolls-page.component";
import {
  RollTypeModalComponent
} from "./roll-type-modal/roll-type-modal.component";
import {
  RollOperationModalComponent
} from "./roll-operation-modal/roll-operation-modal.component";
import {
  RollsRouting
} from "./rolls-routing.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

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
  ]
})

export class RollsModule {}

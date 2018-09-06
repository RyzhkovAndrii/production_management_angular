import {
  Component,
  OnInit,
  ComponentRef
} from '@angular/core';
import {
  IModalDialog,
  IModalDialogOptions
} from 'ngx-modal-dialog';

@Component({
  selector: 'app-product-plan-operation-modal',
  templateUrl: './product-plan-operation-modal.component.html',
  styleUrls: ['./product-plan-operation-modal.component.css']
})
export class ProductPlanOperationModalComponent implements OnInit, IModalDialog {

  constructor() {}

  ngOnInit() {}

  dialogInit(reference: ComponentRef < IModalDialog > , options: Partial < IModalDialogOptions < ProductPlanOperationModalData >> ) {

  }
}

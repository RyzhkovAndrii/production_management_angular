import {
  Component,
  OnInit,
  ComponentRef
} from '@angular/core';
import {
  IModalDialog,
  IModalDialogOptions,
  IModalDialogButton
} from 'ngx-modal-dialog';

@Component({
  selector: 'app-product-operation-select-modal',
  templateUrl: './product-operation-select-modal.component.html',
  styleUrls: ['./product-operation-select-modal.component.css']
})
export class ProductOperationSelectModalComponent implements OnInit, IModalDialog {

  data: ProductOperationSelectModalData;
  actionButtons: IModalDialogButton[];
  private btnClass = 'btn btn-outline-dark';

  constructor() {
    this.actionButtons = [{
      text: 'Закрыть',
      buttonClass: this.btnClass,
      onAction: () => true
    }];
  }

  ngOnInit() {}

  dialogInit(reference: ComponentRef < IModalDialog > , options: Partial < IModalDialogOptions < ProductOperationSelectModalData >> ) {
    this.data = options.data;
  }

  onSelect(operation: ProductOperationResponse) {
    this.data.action(Promise.resolve(operation));
  }
}

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
import {
  RollsService
} from '../../../../app-rolls/services/rolls.service';

@Component({
  selector: 'app-product-plan-operation-select-modal',
  templateUrl: './product-plan-operation-select-modal.component.html',
  styleUrls: ['./product-plan-operation-select-modal.component.css']
})
export class ProductPlanOperationSelectModalComponent implements OnInit, IModalDialog {

  data: ProductPlanOperationSelectModalData;
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

  dialogInit(reference: ComponentRef < IModalDialog > , options: Partial < IModalDialogOptions < ProductPlanOperationSelectModalData >> ) {
    this.data = options.data;
  }

  onSelect(operation: ProductPlanOperationWithRoll) {
    this.data.action(Promise.resolve(operation));
  }
}

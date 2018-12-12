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
  selector: 'app-roll-plan-operation-select-modal',
  templateUrl: './roll-plan-operation-select-modal.component.html',
  styleUrls: ['./roll-plan-operation-select-modal.component.css']
})
export class RollPlanOperationSelectModalComponent implements OnInit, IModalDialog {

  data: RollPlanOperationSelectModalData;
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

  dialogInit(reference: ComponentRef < IModalDialog > , options: Partial < IModalDialogOptions < RollPlanOperationSelectModalData >> ) {
    this.data = options.data;
  }

  onSelect(operation: RollPlanOperationResponse) {
    this.data.action(Promise.resolve(operation));
  }
}

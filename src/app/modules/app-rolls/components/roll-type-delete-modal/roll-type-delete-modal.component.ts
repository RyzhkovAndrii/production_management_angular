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
  selector: 'app-roll-type-delete-modal',
  templateUrl: './roll-type-delete-modal.component.html',
  styleUrls: ['./roll-type-delete-modal.component.css']
})
export class RollTypeDeleteModalComponent implements OnInit, IModalDialog {

  actionButtons: IModalDialogButton[];
  options: Partial < IModalDialogOptions < RollTypeModalData >> ;
  private btnClass = 'btn btn-outline-dark';

  constructor() {
    this.actionButtons = [{
        text: 'Отмена',
        buttonClass: this.btnClass,
        onAction: () => true
      },
      {
        text: 'Удалить',
        buttonClass: this.btnClass,
        onAction: this.onDelete.bind(this)
      }
    ];
  }

  ngOnInit() {}

  dialogInit(reference: ComponentRef < IModalDialog > , options: Partial < IModalDialogOptions < any >> ) {
    this.options = options;
    options.settings = {
      bodyClass: 'modal-body p-0',
      footerClass: 'modal-footer border-top-0'
    };
  };

  onDelete() {
    const type = this.options.data.rollType;
    const resolve = Promise.resolve(type);
    this.options.data.operation(resolve);
    return resolve;
  }
}

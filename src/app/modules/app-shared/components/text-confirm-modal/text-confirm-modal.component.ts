import { Component, OnInit, ComponentRef } from '@angular/core';
import { IModalDialog, IModalDialogOptions } from '../../../../../../node_modules/ngx-modal-dialog';

@Component({
  selector: 'app-text-confirm-modal',
  templateUrl: './text-confirm-modal.component.html',
  styleUrls: ['./text-confirm-modal.component.css']
})
export class TextConfirmModalComponent implements IModalDialog {

  message = "";

  constructor() { }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<string>>) {
    this.message = options.data;
  };

}

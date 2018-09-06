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
  selector: 'app-simple-confirm-modal',
  templateUrl: './simple-confirm-modal.component.html',
  styleUrls: ['./simple-confirm-modal.component.css']
})
export class SimpleConfirmModalComponent implements OnInit, IModalDialog {

  constructor() {
    
  }

  ngOnInit() {}

  dialogInit(reference: ComponentRef < IModalDialog > , options: Partial < IModalDialogOptions < any >> ) {
    options.settings = {
      bodyClass: 'modal-body p-0',
      footerClass: 'modal-footer border-top-0'
    };
  };
}

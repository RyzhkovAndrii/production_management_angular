import {
  Component,
  OnInit,
  Input,
  ComponentRef
} from '@angular/core';
import {
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  IModalDialog,
  IModalDialogOptions,
  IModalDialogButton
} from 'ngx-modal-dialog';

@Component({
  selector: 'app-http-error-modal',
  templateUrl: './http-error-modal.component.html',
  styleUrls: ['./http-error-modal.component.css']
})
export class HttpErrorModalComponent implements OnInit, IModalDialog {

  actionButtons: IModalDialogButton[];
  private btnClass = 'btn btn-outline-dark';

  messages: string[];

  constructor() {
    this.actionButtons = [{
      text: 'Ok',
      buttonClass: this.btnClass
    }];
  }

  ngOnInit() {}

  dialogInit(reference: ComponentRef < IModalDialog > , options: Partial < IModalDialogOptions < string[] >> ) {
    this.messages = options.data;
  };
}

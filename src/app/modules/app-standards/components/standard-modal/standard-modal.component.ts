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
  selector: 'app-standard-modal',
  templateUrl: './standard-modal.component.html',
  styleUrls: ['./standard-modal.component.css']
})
export class StandardModalComponent implements OnInit, IModalDialog {

  constructor() {}

  dialogInit (reference: ComponentRef < IModalDialog > , options: Partial < IModalDialogOptions < any >> ) {

  };

  ngOnInit() {}

}

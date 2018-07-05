import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-client-del-confirm',
  templateUrl: './client-del-confirm.component.html',
  styleUrls: ['./client-del-confirm.component.css']
})
export class ClientDelConfirmComponent {

  @Output() onApply = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();

  constructor() { }

  apply() {
    this.onApply.emit();
  }

  cancel() {
    this.onCancel.emit();
  }

}

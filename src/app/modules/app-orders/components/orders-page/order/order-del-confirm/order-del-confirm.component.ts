import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-order-del-confirm',
  templateUrl: './order-del-confirm.component.html',
  styleUrls: ['./order-del-confirm.component.css']
})
export class OrderDelConfirmComponent {

  @Output()
  onApply = new EventEmitter<any>();

  @Output()
  onCancel = new EventEmitter<any>();

  constructor() { }

  apply() {
    this.onApply.emit();
  }

  cancel() {
    this.onCancel.emit();
  }

}

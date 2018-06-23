import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-order-delivery-confirm',
  templateUrl: './order-delivery-confirm.component.html',
  styleUrls: ['./order-delivery-confirm.component.css']
})
export class OrderDeliveryConfirmComponent implements OnInit {

  form: FormGroup;

  @Output() onSubmit = new EventEmitter<Date>();
  @Output() onCancel = new EventEmitter<any>();

  readonly now: string = moment(new Date()).format("YYYY-MM-DD");

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      "actualDeliveryDate": new FormControl(this.now, [Validators.required])
    })
  }

  submit() {
    const { actualDeliveryDate } = this.form.value;
    this.onSubmit.emit(moment(actualDeliveryDate, "YYYY-MM-DD").toDate()); // todo change format for server (use getDate)
  }

  cancel() {
    this.onCancel.emit();
  }

}

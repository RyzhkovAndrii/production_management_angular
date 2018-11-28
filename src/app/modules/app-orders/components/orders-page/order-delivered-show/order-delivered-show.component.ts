import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-order-delivered-show',
  templateUrl: './order-delivered-show.component.html',
  styleUrls: ['./order-delivered-show.component.css']
})
export class OrderDeliveredShowComponent implements OnInit {

  form: FormGroup;

  @Output() startDateChange = new EventEmitter<Date>();

  isDeliveredOrdersVisible = false;

  readonly now: string = moment(new Date()).format('YYYY-MM-DD');
  startDate: Date;

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      'startDate': new FormControl(null, [Validators.required])
    });
  }

  submit() {
    const { startDate } = this.form.value;
    if (this.startDate !== startDate) {
      this.startDate = startDate;
      this.startDateChange.emit(this.startDate);
    }
  }

  toggleDeliveredOrdersVisible(event) {
    this.isDeliveredOrdersVisible = event.target.checked;
    if (this.isDeliveredOrdersVisible) {
      this.startDate = new Date();
      this.startDate.setDate(this.startDate.getDate() - 5);
      this.form.get('startDate').patchValue(moment(this.startDate).format('YYYY-MM-DD'));
      this.startDateChange.emit(this.startDate);
    } else {
      this.startDateChange.emit(null);
    }
  }

}

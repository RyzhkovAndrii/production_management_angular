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

  @Output() onStartDateChange = new EventEmitter<Date>();

  isDeliveredOrdersVisible: boolean = false;

  readonly now: string = moment(new Date()).format("YYYY-MM-DD");
  startDate: Date;

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      "startDate": new FormControl(null, [Validators.required])
    })
  }

  submit() {
    const { startDate } = this.form.value;
    if (this.startDate !== startDate) {
      this.startDate = startDate;
      this.onStartDateChange.emit(this.startDate);
    }
  }

  toggleDeliveredOrdersVisible(event) {
    this.isDeliveredOrdersVisible = event.target.checked;
    if (this.isDeliveredOrdersVisible) {
      this.startDate = new Date();
      this.startDate.setMonth(this.startDate.getMonth() - 1);
      this.form.get("startDate").patchValue(moment(this.startDate).format("YYYY-MM-DD"));
      this.onStartDateChange.emit(this.startDate);
    } else {
      this.onStartDateChange.emit(null);
    }
  }

}

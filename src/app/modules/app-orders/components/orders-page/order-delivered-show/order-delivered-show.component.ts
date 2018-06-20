import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-order-delivered-show',
  templateUrl: './order-delivered-show.component.html',
  styleUrls: ['./order-delivered-show.component.css']
})
export class OrderDeliveredShowComponent implements OnInit {

  form: FormGroup;

  isDeliveredOrdersVisible: boolean = false;

  readonly now: string = moment(new Date()).format("YYYY-MM-DD");
  startDate: Date = new Date();

  constructor() { }

  ngOnInit() {
    this.startDate.setMonth(new Date().getMonth() - 1);
    this.form = new FormGroup({
      "startDate": new FormControl(moment(this.startDate).format("YYYY-MM-DD"), [Validators.required])
    })
  }

  toggleDeliveredOrdersVisible(event) {
    this.isDeliveredOrdersVisible = event.target.checked;
  }

}

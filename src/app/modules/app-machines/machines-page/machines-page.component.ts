import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-machines-page',
  templateUrl: './machines-page.component.html',
  styleUrls: ['./machines-page.component.css']
})
export class MachinesPageComponent implements OnInit {

  hours: number[];
  selectedDate: Date = new Date();

  dateForm = new FormGroup({
    'date': new FormControl(moment().format('YYYY-MM-DD'), [Validators.required])
  })

  constructor() {
    this.hours = Array(24).fill(0).map((x, i) => i);
  }

  ngOnInit() {
  }

  dateChange() {
    const { date } = this.dateForm.value;
    this.selectedDate = date;
  }

}

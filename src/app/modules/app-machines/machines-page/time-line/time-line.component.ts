import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.css']
})
export class TimeLineComponent implements OnInit {

  hours: number[];

  constructor() {
    this.hours = Array(24).fill(0).map((x, i) => {
      return i < 16 ? i + 8 : i - 16;
    });
  }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-machines-page',
  templateUrl: './machines-page.component.html',
  styleUrls: ['./machines-page.component.css']
})
export class MachinesPageComponent implements OnInit {

  hours: number[];

  constructor() {
    this.hours = Array(24).fill(0).map((x, i) => i);
  }

  ngOnInit() {
  }

}

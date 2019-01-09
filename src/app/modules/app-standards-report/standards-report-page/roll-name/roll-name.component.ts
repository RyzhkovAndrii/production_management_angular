import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-roll-name',
  templateUrl: './roll-name.component.html',
  styleUrls: ['./roll-name.component.css']
})
export class RollNameComponent implements OnInit {

  @Input() rollType: RollType;

  constructor() { }

  ngOnInit() {
  }

}

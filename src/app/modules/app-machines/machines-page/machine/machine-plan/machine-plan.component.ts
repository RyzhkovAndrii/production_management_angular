import { Component, OnInit, Input } from '@angular/core';

import { MachinePlan } from '../../../models/machine-plan.model';


@Component({
  selector: 'app-machine-plan',
  templateUrl: './machine-plan.component.html',
  styleUrls: ['./machine-plan.component.css']
})
export class MachinePlanComponent implements OnInit {

  @Input() plan: MachinePlan;

  color: string;
  width: number;
  isPlanEmpty: boolean;

  constructor() { }

  ngOnInit() {
    this.isPlanEmpty = this.plan.productTypeId === undefined;
    this.width = this.plan.duration * 90 / 24;
    this.color = this.isPlanEmpty ? 'grey' : this.plan.isImportant ? '#de3163' : 'white';
  }

}

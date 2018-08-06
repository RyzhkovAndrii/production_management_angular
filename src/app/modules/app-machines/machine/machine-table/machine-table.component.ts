import { Component, OnInit, Input } from '@angular/core';
import { MachinePlanItem } from '../../models/machine-plan-item.model';

@Component({
  selector: 'app-machine-table',
  templateUrl: './machine-table.component.html',
  styleUrls: ['./machine-table.component.css']
})
export class MachineTableComponent implements OnInit {

  @Input() machinePlan: MachinePlanItem[];

  constructor() { }

  ngOnInit() {
  }

}

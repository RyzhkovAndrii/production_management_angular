import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

import { MachinePlan } from '../../models/machine-plan.model';
import { MachineModuleStoreDataService } from '../../services/machine-module-store-data.service';

interface TableData {
  plan: MachinePlan;
  standard: Standard;
  startTime: Date;
  finishTime: Date;
}

@Component({
  selector: 'app-machine-table',
  templateUrl: './machine-table.component.html',
  styleUrls: ['./machine-table.component.css']
})
export class MachineTableComponent implements OnInit {

  @Input() machinePlans$: Observable<MachinePlan[]>;

  @Output() planRemove = new EventEmitter<MachinePlan>();

  standards$: Observable<Standard[]>;
  tableData$: Observable<TableData[]>;

  constructor(
    private dataService: MachineModuleStoreDataService
  ) { }

  ngOnInit() {
    this.standards$ = this.dataService.getStandards();
    this.tableData$ = this.getTableData();
  }

  onRemovePlan(plan: MachinePlan) {
    this.planRemove.emit(plan);
  }

  private getTableData(): Observable<TableData[]> {
    return Observable.combineLatest(
      this.machinePlans$,
      this.standards$,
      (plans, standards) => plans.map(plan => this.getTableRow(plan, standards)));
  }

  private getTableRow(plan: MachinePlan, standards: Standard[]): TableData {
    const momentStart = moment(plan.timeStart, 'DD-MM-YYYY HH:mm:SS');
    const start = momentStart.toDate();
    const finish = momentStart.add(plan.duration, 'hours').toDate();
    return {
      plan: plan,
      standard: standards.find(standard => standard.productTypeId === plan.productTypeId),
      startTime: start,
      finishTime: finish
    };
  }

}

import { Component, OnInit } from '@angular/core';
import { Observable } from '../../../../../../node_modules/rxjs';

import { MachineModuleCasheService } from '../../services/machine-module-cashe.service';
import { MachineModuleStoreDataService } from '../../services/machine-module-store-data.service';
import { ProductsPlanService } from '../../../app-products-plan/services/products-plan.service';

interface TableData {
  plan: ProductPlanBatchResponse;
  type: ProductTypeResponse;
}

@Component({
  selector: 'app-daily-plan-table',
  templateUrl: './daily-plan-table.component.html',
  styleUrls: ['./daily-plan-table.component.css']
})
export class DailyPlanTableComponent implements OnInit {

  tableData$: Observable<TableData[]>;

  constructor(
    private casheService: MachineModuleCasheService,
    private dataService: MachineModuleStoreDataService,
    private planService: ProductsPlanService
  ) { }

  ngOnInit() {
    this.tableData$ = this.fetchTableData();
  }

  fetchTableData(): Observable<TableData[]> {
    return this.dataService
      .getDailyPlan()
      .flatMap(plans => {
        return Observable.forkJoin(
          plans.map(plan => {
            return this.casheService
              .getProductType(plan.productTypeId)
              .map(type => {
                return { plan, type };
              });
          })
        );
      });
  }

  equalizePlanAmount(plan: ProductPlanBatchResponse) {
    this.planService
      .equalizePlanToMachinePlan(plan.productTypeId, plan.date)
      .subscribe(() => this.dataService.equalizeDailyPlan(plan));
  }

}

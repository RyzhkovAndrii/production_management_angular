import { Component, OnInit } from '@angular/core';
import { Observable } from '../../../../../../node_modules/rxjs';

import { MachineModuleCasheService } from '../../services/machine-module-cashe.service';
import { MachineModuleStoreDataService } from '../../services/machine-module-store-data.service';

@Component({
  selector: 'app-daily-plan-table',
  templateUrl: './daily-plan-table.component.html',
  styleUrls: ['./daily-plan-table.component.css']
})
export class DailyPlanTableComponent implements OnInit {

  tableData$: Observable<{ plan: ProductPlanBatchResponse, type: ProductTypeResponse }[]>;

  productTypes: ProductTypeResponse[] = [];

  fetchedPlans$: Observable<{ ProductPlanBatchResponse, ProductTypeResponse }[]>;

  constructor(
    private casheService: MachineModuleCasheService,
    private dataService: MachineModuleStoreDataService
  ) { }

  ngOnInit() {
    this.tableData$ = this.fetchTableData();
  }

  fetchTableData(): Observable<{ plan: ProductPlanBatchResponse, type: ProductTypeResponse }[]> {
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

  changePlanAmount(plan: ProductPlanBatchResponse) {
    // todo change product operations amount
  }

}

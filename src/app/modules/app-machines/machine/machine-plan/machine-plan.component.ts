import { Component, OnInit, Input } from '@angular/core';

import { MachinePlan } from '../../models/machine-plan.model';
import { Observable } from 'rxjs/Observable';
import { MachineModuleCasheService } from '../../services/machine-module-cashe.service';

@Component({
  selector: 'app-machine-plan',
  templateUrl: './machine-plan.component.html',
  styleUrls: ['./machine-plan.component.css']
})
export class MachinePlanComponent implements OnInit {

  @Input() plan: MachinePlan;
  plan$: Observable<MachinePlan>;

  color: string;
  width: number;
  isPlanEmpty: boolean;

  constructor(
    private casheService: MachineModuleCasheService
  ) { }

  ngOnInit() {
    this.isPlanEmpty = this.plan.productTypeId === undefined;
    this.width = this.plan.duration * 90 / 24;
    this.color = this.isPlanEmpty ? 'grey' : this.plan.isImportant ? '#de3163' : 'white';
    this.plan$ = this.getDetailedPlan(this.plan);
  }

  private getDetailedPlan(plan: MachinePlan): Observable<MachinePlan> {
    return this.isPlanEmpty
      ? Observable.of(plan)
      : Observable.of(this.plan)
        .flatMap(obsPlan => {
          return this.casheService
            .getProductType(obsPlan.productTypeId)
            .map(productType => {
              console.log(productType);
              plan.productType = productType;
              return plan;
            });
        });
  }

}

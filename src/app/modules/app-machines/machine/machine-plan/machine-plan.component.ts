import { Component, OnInit, Input, ViewContainerRef, Output, EventEmitter } from '@angular/core';

import { MachinePlan } from '../../models/machine-plan.model';
import { ProductsService } from '../../../app-products/services/products.service';

@Component({
  selector: 'app-machine-plan',
  templateUrl: './machine-plan.component.html',
  styleUrls: ['./machine-plan.component.css']
})
export class MachinePlanComponent implements OnInit {

  @Input() plan: MachinePlan;

  detailsPlan: MachinePlan;
  width: number;
  isFetched = false;

  constructor(
    private productService: ProductsService
  ) { }

  ngOnInit() {
    this.fetchDetails();
  }

  isEmpty(plan: MachinePlan) {
    return plan.productTypeId === undefined;
  }

  getColor(plan: MachinePlan) {
    return plan.productType !== undefined
      ? plan.productType.colorCode 
      : 'white';
  }

  private fetchDetails() {
    this.detailsPlan = this.plan;
    if (this.plan.productTypeId !== undefined) {
      this.productService
        .getProductType(this.plan.productTypeId)
        .subscribe(response => {
          this.detailsPlan.productType = response
          this.isFetched = true;
        });
    } else {
      this.isFetched = true;
    }
  }

}

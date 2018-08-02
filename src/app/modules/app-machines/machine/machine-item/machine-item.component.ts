import { Component, OnInit, Input } from '@angular/core';

import { MachinePlanItem } from '../../models/machine-plan-item.model';
import { ProductsService } from '../../../app-products/services/products.service';

@Component({
  selector: 'app-machine-item',
  templateUrl: './machine-item.component.html',
  styleUrls: ['./machine-item.component.css']
})
export class MachineItemComponent implements OnInit {

  @Input() planItem: MachinePlanItem;

  detailsPlanItem: MachinePlanItem;
  width: number;
  isFetched = false;

  constructor(
    private productService: ProductsService
  ) { }

  ngOnInit() {
    this.fetchDetails();
  }

  isEmpty(planItem: MachinePlanItem) {
    return planItem.productTypeId === undefined;
  }

  getColor(planItem: MachinePlanItem) {
    return planItem.productType !== undefined
      ? planItem.productType.colorCode
      : 'white';
  }

  openPlanItemEditForm() {

  }

  openInfo() {
    
  }

  private fetchDetails() {
    this.detailsPlanItem = this.planItem;
    if (this.planItem.productTypeId !== undefined) {
      this.productService
        .getProductType(this.planItem.productTypeId)
        .subscribe(response => {
          this.detailsPlanItem.productType = response
          this.isFetched = true;
        });
    } else {
      this.isFetched = true;
    }
  }

}

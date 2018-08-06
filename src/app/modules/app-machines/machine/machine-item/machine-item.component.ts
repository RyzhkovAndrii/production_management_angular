import { Component, OnInit, Input, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { ModalDialogService } from '../../../../../../node_modules/ngx-modal-dialog';

import { MachinePlanItem } from '../../models/machine-plan-item.model';
import { ProductsService } from '../../../app-products/services/products.service';

@Component({
  selector: 'app-machine-item',
  templateUrl: './machine-item.component.html',
  styleUrls: ['./machine-item.component.css']
})
export class MachineItemComponent implements OnInit {

  @Input() planItem: MachinePlanItem;
  @Input() currentIndex: number;

  @Output() onFormOpen = new EventEmitter<number>();

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

  openPlanItemForm() {
    this.onFormOpen.emit(this.currentIndex);
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

import { Component, OnInit, Input } from '@angular/core';
import { MachineService } from '../services/machine.service';
import { MachinePlanItem } from '../models/machine-plan-item.model';
import { ProductsService } from '../../app-products/services/products.service';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.css']
})
export class MachineComponent implements OnInit {

  @Input() public machineNumber: number;

  public machinePlan: MachinePlanItem[];

  constructor(
    private machineService: MachineService,
    private productsService: ProductsService
  ) { }

  ngOnInit() {
    this.fetchPlanData();
  }

  private fetchPlanData() {
    this.machineService
      .getAll(this.machineNumber)
      .subscribe(response => {
        this.machinePlan = response;
        this.machinePlan.map(planItem => this.getDetails(planItem))
      });
  }

  private getDetails(planItem: MachinePlanItem): MachinePlanItem {
    this.productsService
      .getProductType(planItem.productTypeId)
      .subscribe(response => planItem.productType = response);
    return planItem;
  }



}

import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { DailyProductPlanService } from '../../services/daily-product-plan.service';
import { Observable } from '../../../../../../node_modules/rxjs';
import { ModalDialogService } from '../../../../../../node_modules/ngx-modal-dialog';
import { AppModalService } from '../../../app-shared/services/app-modal.service';

@Component({
  selector: 'app-daily-plan-table',
  templateUrl: './daily-plan-table.component.html',
  styleUrls: ['./daily-plan-table.component.css']
})
export class DailyPlanTableComponent implements OnInit {

  @Input() dailyPlans: ProductPlanBatchResponse[];
  productTypes: ProductTypeResponse[] = [];

  isFetched = false;

  constructor(
    private planService: DailyProductPlanService,
    private viewRef: ViewContainerRef,
    private ngxModalDialogService: ModalDialogService,
    private appModalService: AppModalService
  ) { }

  ngOnInit() {
    this.fetchProductTypes();
  }

  fetchProductTypes() {
    this.isFetched = false;
    const obs: Observable<ProductTypeResponse>[] = [];
    this.dailyPlans.forEach(plan => obs.push(this.planService.getProductType(plan.productTypeId)));
    Observable
      .forkJoin(obs)
      .subscribe(
        response => {
          response.forEach(type => this.productTypes.push(type));
        },
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error))
  }

  amountDiff(plan: ProductPlanBatchResponse) {
    return plan.manufacturedAmount - plan.productToMachinePlane;
  }

}

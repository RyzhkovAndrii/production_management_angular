import {
  Component,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import {
  ModalDialogService
} from 'ngx-modal-dialog';

import {
  ProductsPlanService
} from '../../services/products-plan.service';
import {
  midnightDate,
  addDays
} from '../../../../app-utils/app-date-utils';
import {
  AppModalService
} from '../../../app-shared/services/app-modal.service';

@Component({
  selector: 'app-products-plan-page',
  templateUrl: './products-plan-page.component.html',
  styleUrls: ['./products-plan-page.component.css']
})
export class ProductsPlanPageComponent implements OnInit {

  currentDate: Date;
  fromDate: Date;
  toDate: Date;
  productsPlanInfo: ProductPlanInfo[] = [];

  firstWeekHeaderDates: Date[] = [];
  secondWeekHeaderDates: Date[] = [];

  constructor(
    private productsPlanService: ProductsPlanService,
    private ngxModalService: ModalDialogService,
    private viewRef: ViewContainerRef,
    private appModalService: AppModalService
  ) {}

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.initDateHeaders();
    this.productsPlanService.getProductPlanInfo(this.currentDate, this.toDate)
      .subscribe(
        data => this.productsPlanInfo = data,
        error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error)
      );
  }

  private initDateHeaders() {
    this.currentDate = midnightDate();
    this.fromDate = addDays(this.currentDate, 1);
    this.toDate = addDays(this.currentDate, 14);
    for (let i = 1; i <= 7; i++) {
      this.firstWeekHeaderDates.push(addDays(this.currentDate, i));
    }
    for (let i = 8; i <= 14; i++) {
      this.secondWeekHeaderDates.push(addDays(this.currentDate, i));
    }
  }
}

import {
  Component,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import {
  ModalDialogService
} from 'ngx-modal-dialog';

import {
  ProductsService
} from '../../services/products.service';
import {
  getDateFirstDayOfMonth,
  midnightDate
} from '../../../../app-utils/app-date-utils';
import {
  AppModalService
} from '../../../app-shared/services/app-modal.service';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css']
})
export class ProductsPageComponent implements OnInit {

  productsInfo: ProductInfo[][] = [];
  daylyDate: Date;
  toDate: Date;
  fromDate: Date;

  constructor(private productsService: ProductsService,
    private viewRef: ViewContainerRef,
    private ngxModalDialogService: ModalDialogService,
    private appModalService: AppModalService) {
    this.daylyDate = midnightDate();
    this.toDate = midnightDate();
    this.fromDate = getDateFirstDayOfMonth(this.daylyDate);
  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.productsService.getProductsInfo(this.daylyDate, this.fromDate, this.toDate)
      .subscribe(data => {
        console.log(data);
        this.productsInfo = data;
      }, error => {
        this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error);
      });
  }

  getSectionTotals(values: ProductInfo[]): number[] {
    return values.reduce((previousValue, currentValue, currentIndex, array) => {
      previousValue[0] += currentValue.restLeftover.amount;
      previousValue[1] += currentValue.dayBatch.manufacturedAmount || 0;
      previousValue[2] += currentValue.monthBatch.manufacturedAmount || 0;
      previousValue[3] += currentValue.dayBatch.soldAmount || 0;
      previousValue[4] += currentValue.monthBatch.soldAmount || 0;
      previousValue[5] += currentValue.currentLeftover.amount;
      return previousValue;
    }, new Array(6).fill(0, 0));
  }

  getTotals(): number[] {
    return this.productsInfo.reduce((previousValue, currentValue, currentIndex, array) => {
      const sectionTotals = this.getSectionTotals(currentValue);
      return previousValue.map((value, index, array) => array[index] += sectionTotals[index]);
    }, new Array(6).fill(0, 0));
  }
}

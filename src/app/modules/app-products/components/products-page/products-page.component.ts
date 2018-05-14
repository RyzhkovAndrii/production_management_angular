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

  productsInfo: ProductInfo[] = [];
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
}

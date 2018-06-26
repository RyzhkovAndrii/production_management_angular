import { Component, OnInit, Input } from '@angular/core';
import { DatepickerOptions } from 'ng2-datepicker';
import * as moment from 'moment';
import * as ruLocale from 'date-fns/locale/ru';

import { ProductsService } from '../../../../app-products/services/products.service';
import { getDate } from '../../../../../app-utils/app-date-utils';

const now: Date = new Date();

@Component({
  selector: 'app-order-leftover-product',
  templateUrl: './order-leftover-product.component.html',
  styleUrls: ['./order-leftover-product.component.css']
})
export class OrderLeftoverProductComponent implements OnInit {

  @Input() isLastLeftOver: boolean = false;
  @Input() producTypeList: ProductTypeResponse[];

  private productLeftOverList: ProductLeftoverResponse[];
  sortedProductLeftOverList: ProductLeftoverResponse[];

  date: Date;

  datePickerOptions: DatepickerOptions = {
    firstCalendarDay: 1,
    locale: ruLocale,
    addClass: 'form-control',
    minDate: moment().add(-1, 'days').toDate(),
    minYear: moment().toDate().getFullYear(),
    dayNamesFormat: 'dd'
  };

  constructor(private productService: ProductsService) {
    this.sortedProductLeftOverList = [];
  }

  ngOnInit() {
    if (this.isLastLeftOver) {
      this.fetchLastLeftOverList();
    } else {
      this.date = now;
      this.fetchLeftOverList();
    }
  }

  reloadCurrentLeftOver() {
    this.fetchLeftOverList();
  }

  private fetchLeftOverList() {
    this.productService.getProductsLeftovers(this.date)
      .subscribe(data => {
        this.productLeftOverList = data;
        this.sortProductLeftOverList();
      });
  }

  private fetchLastLeftOverList() {
    this.productService.getLastProductsLeftOvers()
      .subscribe(data => {
        this.productLeftOverList = data;
        this.sortProductLeftOverList();
        this.date = getDate(data[0].date);
      });
  }

  private sortProductLeftOverList() {
    this.sortedProductLeftOverList = [];
    this.producTypeList.forEach(productType => {
      const leftover = this.productLeftOverList.find(leftover => leftover.productTypeId === productType.id);
      this.sortedProductLeftOverList.push(leftover);
    })
  }

}

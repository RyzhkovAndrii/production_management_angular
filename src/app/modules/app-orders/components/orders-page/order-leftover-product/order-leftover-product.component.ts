import { Component, OnInit, Input } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { ProductsService } from '../../../../app-products/services/products.service';
import { getDate } from '../../../../../app-utils/app-date-utils';

const now: Date = new Date();

@Component({
  selector: 'app-order-leftover-product',
  templateUrl: './order-leftover-product.component.html',
  styleUrls: ['./order-leftover-product.component.css']
})
export class OrderLeftoverProductComponent implements OnInit {

  @Input()
  isLastLeftOver: boolean = false;

  private productLeftOverList: ProductLeftoverResponse[];

  sortedProductLeftOverList: ProductLeftoverResponse[];

  date: Date;

  minDate: NgbDateStruct;

  constructor(private productService: ProductsService) {
    this.sortedProductLeftOverList = [];
    this.minDate = this.convertToDateStruct(now);
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
    this.productService.getSingletonProductTypes().forEach(productType => {
      const leftover = this.productLeftOverList.find(leftover => leftover.productTypeId === productType.id);
      this.sortedProductLeftOverList.push(leftover);
    })
  }

  private convertToDateStruct(date: Date): NgbDateStruct {
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() }
  }

}

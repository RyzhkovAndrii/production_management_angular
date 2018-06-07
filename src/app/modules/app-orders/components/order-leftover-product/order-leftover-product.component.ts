import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core';
import { NgbDateStruct, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

import { getDate } from '../../../../app-utils/app-date-utils';
import { ProductsService } from '../../../app-products/services/products.service';
import { Subscription } from 'rxjs';

const now: Date = new Date();

@Component({
  selector: 'app-order-leftover-product',
  templateUrl: './order-leftover-product.component.html',
  styleUrls: ['./order-leftover-product.component.css']
})
export class OrderLeftoverProductComponent implements OnInit, OnDestroy {

  @Input()
  isLastLeftOver: boolean = false;

  private productLeftOverList: ProductLeftoverResponse[];

  sortedProductLeftOverList: ProductLeftoverResponse[];

  date: Date;

  minDate: NgbDateStruct;

  private sub1: Subscription;
  private sub2: Subscription;

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

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }

  fetchLeftOverList() {
    this.sub1 = this.productService.getProductsLeftovers(this.date)
      .subscribe(data => {
        this.productLeftOverList = data;
        this.sortProductLeftOverList();
      });
  }

  fetchLastLeftOverList() {
    this.sub2 = this.productService.getLastProductsLeftOvers()
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

  private convertToDate(dateStruct: NgbDateStruct): Date {
    return new Date(`${dateStruct.year}-${dateStruct.month}-${dateStruct.day}`);
  }

  private convertToDateStruct(date: Date): NgbDateStruct {
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() }
  }

}

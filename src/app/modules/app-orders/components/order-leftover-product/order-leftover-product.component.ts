import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-order-leftover-product',
  templateUrl: './order-leftover-product.component.html',
  styleUrls: ['./order-leftover-product.component.css']
})
export class OrderLeftoverProductComponent implements OnInit {

  @Input()
  productTypeList: ProductTypeResponse[];

  @Input()
  productLeftOverList: ProductLeftoverResponse[];

  sortedProductLeftOverList: ProductLeftoverResponse[];

  constructor() {
    this.sortedProductLeftOverList = [];
  }

  ngOnInit() {
    this.sortProductLeftOverList();
  }

  private sortProductLeftOverList() {
    this.productTypeList.forEach(productType => {
      const leftover = this.productLeftOverList.find(leftover => leftover.productTypeId === productType.id);
      this.sortedProductLeftOverList.push(leftover);
    })
  }

}

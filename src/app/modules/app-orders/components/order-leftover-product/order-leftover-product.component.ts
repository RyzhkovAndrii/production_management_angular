import { Component, OnInit, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductsService } from '../../../app-products/services/products.service';

@Component({
  selector: 'app-order-leftover-product',
  templateUrl: './order-leftover-product.component.html',
  styleUrls: ['./order-leftover-product.component.css']
})
export class OrderLeftoverProductComponent implements OnInit {


  private productLeftOverList: ProductLeftoverResponse[];

  @Input()
  productTypeList: ProductTypeResponse[];

  sortedProductLeftOverList: ProductLeftoverResponse[];

  date: Date; 

  constructor(private productService: ProductsService) {
    this.sortedProductLeftOverList = [];
  }

  ngOnInit() {
    this.productService.getProductsLeftovers(new Date('2018-05-28'))
      .subscribe(data => {
        this.productLeftOverList = data;
        this.sortProductLeftOverList();
      });
    this.date = new Date('2018-05-28'); // todo choise of date
  }

  private sortProductLeftOverList() {
    this.productTypeList.forEach(productType => {
      const leftover = this.productLeftOverList.find(leftover => leftover.productTypeId === productType.id);
      this.sortedProductLeftOverList.push(leftover);
    })
  }

}

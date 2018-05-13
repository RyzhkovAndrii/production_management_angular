import {
  Component,
  OnInit
} from '@angular/core';
import {
  ProductsService
} from '../../services/products.service';
import {
  getDateFirstDayOfMonth,
  midnightDate
} from '../../../../app-utils/app-date-utils';

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

  constructor(private productsService: ProductsService) {
    this.daylyDate = midnightDate();
    this.toDate = midnightDate();
    this.fromDate = getDateFirstDayOfMonth(this.daylyDate);
  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.productsService.getProductsInfo(this.daylyDate, this.fromDate, this.toDate)
      .subscribe(data => this.productsInfo = data, error => {});
  }
}

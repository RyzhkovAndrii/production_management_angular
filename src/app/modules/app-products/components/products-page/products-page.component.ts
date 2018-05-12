import {
  Component,
  OnInit
} from '@angular/core';
import {
  ProductsService
} from '../../services/products.service';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css']
})
export class ProductsPageComponent implements OnInit {

  productsInfo: ProductInfo[] = []

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {

  }
}

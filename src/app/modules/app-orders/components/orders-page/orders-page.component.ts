import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { Observable } from 'rxjs/Observable';
import { ClientsService } from '../../services/client.service';
import { ProductsService } from '../../../app-products/services/products.service';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css']
})
export class OrdersPageComponent implements OnInit {

  orderDetailses: Observable<OrderDetails[]>;
  productTypes: Observable<ProductTypeResponse[]>

  constructor(private ordersService: OrdersService,
    private clientsService: ClientsService,
    private productsService: ProductsService) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.orderDetailses = this.ordersService.getOrderDetailsList();
    this.productTypes = this.sortProductTypesByColorAndWeight(this.productsService.getProductTypes());
  }

  sortProductTypesByColorAndWeight(productTypeList: Observable<ProductTypeResponse[]>): Observable<ProductTypeResponse[]> {
    return productTypeList.map((data) => {
      data.sort((a, b) => {
        return a.colorCode < b.colorCode ? -1 : 1;
      });
      return data;
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { Observable } from 'rxjs/Observable';
import { ClientsService } from '../../services/client.service';
import { ProductsService } from '../../../app-products/services/products.service';
import { getDate } from '../../../../app-utils/app-date-utils';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css']
})
export class OrdersPageComponent implements OnInit {

  orderResponses: OrderResponse[];
  productTypes: ProductTypeResponse[];
  productLeftOvers: ProductLeftoverResponse[];

  constructor(private ordersService: OrdersService,
    private clientsService: ClientsService,
    private productsService: ProductsService) { }

  ngOnInit() {
    this.fetchData();
  }

  private fetchData() {
    this.productsService.getSortedProductTypes()
      .subscribe(data => {
        this.productTypes = data;
        this.ordersService.getOrderList().subscribe(data => this.orderResponses = data);
        this.productsService.getProductsLeftovers(getDate("27-05-2018")).subscribe(data => this.productLeftOvers = data);
      });
  }

}

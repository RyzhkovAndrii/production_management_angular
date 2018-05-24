import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { Observable } from 'rxjs/Observable';
import { ClientsService } from '../../services/client.service';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css']
})
export class OrdersPageComponent implements OnInit {

  orderDetailses: Observable<OrderDetails[]>;

  constructor(private ordersService: OrdersService, private clientsService: ClientsService) { }

  ngOnInit() {
    this.fetchData();    
  }

  fetchData() {
    this.orderDetailses = this.ordersService.getOrderDetailsList();
  }  

}

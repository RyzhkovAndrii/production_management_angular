import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ClientsService } from '../../services/client.service';
import { OrdersService } from '../../services/orders.service';
import { ProductsService } from '../../../app-products/services/products.service';
import { Order } from '../../models/order.model';
import { Client } from '../../models/client.model';
import { OrderDetails } from '../../models/order-details.model';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css']
})
export class OrdersPageComponent implements OnInit, OnDestroy {

  @ViewChild('lastLeftover') lastLeftover;

  orderList: Order[];
  productTypes: ProductTypeResponse[];
  productLeftOvers: ProductLeftoverResponse[];
  clientList: Client[] = [];
  editedOrder: OrderDetails;

  isOrderCreateVisible: boolean = false;
  isOrderEditVisible: boolean = false;
  isClientListVisible: boolean = false;

  showDeliveredOrderStartDate: Date = null;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private ordersService: OrdersService,
    private clientsService: ClientsService,
    private productsService: ProductsService
  ) { }

  ngOnInit() {
    this.fetchData();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private fetchData() {
    Observable
      .combineLatest(
        this.productsService.getSortedProductTypes(),
        this.ordersService.getOrderList(),
        this.clientsService.getAll())
      .takeUntil(this.ngUnsubscribe)
      .subscribe(data => {
        this.productTypes = data[0];
        this.orderList = data[1];
        this.clientList = data[2]; // todo load if need
      });
  }

  private reloadOrderList() {
    if (this.showDeliveredOrderStartDate === null) {
      this.ordersService.getOrderList()
        .subscribe(data => this.orderList = data);
    } else {
      this.ordersService
        .getOrderListWithDelivered(this.showDeliveredOrderStartDate)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(data => this.orderList = data);
    }
  }

  reloadPage() {
    this.reloadOrderList();
    this.lastLeftover.reloadCurrentLeftOver();
  }

  toggleDeliveredOrderVisibility(startDate: Date) {
    this.showDeliveredOrderStartDate = startDate;
    this.reloadOrderList();
  }

  onOrderCreateApply(order: Order) { // todo save in array ???
    this.reloadPage();
  }

  onOrderCreateCancel() {
    this.isOrderCreateVisible = false;
  }

  openOrderCreate() {
    this.isOrderCreateVisible = true;
  }

  onOrderEditApply(order: Order) { // todo save in array ???
    this.reloadPage();
  }

  onOrderEditCancel() {
    this.isOrderEditVisible = false;
  }

  openOrderEdit(order: OrderDetails) {
    this.editedOrder = order;
    this.isOrderEditVisible = true;
  }

  openClientList() {
    this.isClientListVisible = true;
  }

  onClientListCancel() {
    this.isClientListVisible = false;
  }

}

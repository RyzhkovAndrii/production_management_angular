import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';

import { ClientsService } from '../../services/client.service';
import { OrdersService } from '../../services/orders.service';
import { ProductsService } from '../../../app-products/services/products.service';
import { Order } from '../../models/order.model';
import { Client } from '../../models/client.model';

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

  isOrderCreateVisible: boolean = false;
  isClientListVisible: boolean = false; // todo remove

  private sub1: Subscription;
  private sub2: Subscription;

  constructor(
    private ordersService: OrdersService,
    private clientsService: ClientsService,
    private productsService: ProductsService
  ) { }

  ngOnInit() {
    this.fetchData();
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }

  private fetchData() {
    this.sub1 = Observable
      .combineLatest(
        this.productsService.getSortedProductTypes(),
        this.ordersService.getOrderList(),
        this.clientsService.getAll()) // todo remove
      .subscribe(data => {
        this.productTypes = data[0];
        this.orderList = data[1];
        this.clientList = data[2]; // todo remove
      });
  }

  private reloadOrderList() {
    this.ordersService.getOrderList().subscribe(data => this.orderList = data);
  }

  reloadPage() {
    this.reloadOrderList();
    this.lastLeftover.reloadCurrentLeftOver();
  }

  onOrderCreateApply(order: Order) { // todo save in array ???
    this.reloadPage();
  }

  onOrderCreateCancel() {
    this.isOrderCreateVisible = false;
  }

  openOrderCreate() {
    if (this.clientList.length === 0) {
      this.sub2 = this.clientsService.getAll()
        .subscribe(data => {
          this.clientList = data;
          this.isOrderCreateVisible = true;
        });
    } else {
      this.isOrderCreateVisible = true;
    }
  }

  openClientList() { // todo remove
    this.isClientListVisible = true;
    this.onOrderCreateCancel();
  }

  onClientListCancel() {
    this.isClientListVisible = false; // todo remove
    this.openOrderCreate();
  }

}

import { Component, OnInit, Input, ViewContainerRef, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { OrdersService } from '../../services/orders.service';
import { Order } from '../../models/order.model';
import { OrderDetails } from '../../models/order-details.model';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {

  orderDetails: OrderDetails;

  @Input() order: Order;

  @Output() onChange = new EventEmitter<any>();

  private clientList: Client[] = [];

  isOrderDelConfirmVisible: boolean = false;

  private sub1: Subscription;
  private sub2: Subscription;
  private sub3: Subscription;

  constructor(private orderService: OrdersService) { }

  ngOnInit() {
    this.orderDetails = this.orderService.convert(this.order);
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
    if (this.sub3) {
      this.sub3.unsubscribe();
    }
  }

  openOrderEditForm() {
    // todo 
  }

  deliverOrder() {
    const { client, city, deliveryDate, isImportant } = this.orderDetails;
    const newOrder = new Order(client.id, city, deliveryDate, isImportant, true);
    this.sub2 = this.orderService.update(newOrder, this.orderDetails.id)
      .subscribe(() => {
        this.onChange.emit();
      });
  }

  returnOrder() {
    const { client, city, deliveryDate, isImportant } = this.orderDetails;
    const newOrder = new Order(client.id, city, deliveryDate, isImportant, false);
    this.orderService.update(newOrder, this.orderDetails.id)
      .subscribe(() => {
        this.onChange.emit();
      });
  }

  private orderDelete() {
    this.sub3 = this.orderService.delete(this.orderDetails.id)
      .subscribe(() => {
        this.onChange.emit();
      });
  }

  openOrderDelConfirm() {
    this.isOrderDelConfirmVisible = true;
  }

  onOrderDelConfirmApply() {
    this.isOrderDelConfirmVisible = false;
    this.orderDelete();
  }

  onOrderDelConfirmCancel() {
    this.isOrderDelConfirmVisible = false;
  }

}

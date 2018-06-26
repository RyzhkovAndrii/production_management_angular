import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment';

import { Order } from '../../../models/order.model';
import { OrderDetails } from '../../../models/order-details.model';
import { OrdersService } from '../../../services/orders.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  orderDetails: OrderDetails;

  @Input() order: Order;

  @Output() onChange = new EventEmitter<any>();
  @Output() onEditOpen = new EventEmitter<OrderDetails>();

  isOrderDelConfirmVisible: boolean = false;
  isOrderDeliveryConfirmVisible: boolean = false;

  constructor(private orderService: OrdersService) { }

  ngOnInit() {
    this.orderDetails = this.orderService.convert(this.order);
  }

  openOrderEditForm() {
    this.onEditOpen.emit(this.orderDetails);
  }

  deliverOrder(date: Date) {
    const { client, city, deliveryDate, isImportant } = this.orderDetails;
    const newOrder = new Order(client.id, city, deliveryDate, isImportant, true, moment(date).format('YYYY-MM-DD')); // todo use common format date
    this.orderService.update(newOrder, this.orderDetails.id)
      .subscribe(() => {
        this.onChange.emit();
      });
  }

  returnOrder() {
    const { client, city, deliveryDate, isImportant } = this.orderDetails;
    const newOrder = new Order(client.id, city, deliveryDate, isImportant, false, null);
    this.orderService.update(newOrder, this.orderDetails.id)
      .subscribe(() => {
        this.onChange.emit();
      });
  }

  private orderDelete() {
    this.orderService.delete(this.orderDetails.id)
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

  openOrderDeliveryConfirm() {
    this.isOrderDeliveryConfirmVisible = true;
  }

  onOrderDeliveryConfirmApply(date: Date) {
    this.isOrderDeliveryConfirmVisible = false;
    this.deliverOrder(date);
  }

  onOrderDeliveryConfirmCancel() {
    this.isOrderDeliveryConfirmVisible = false;
  }

}

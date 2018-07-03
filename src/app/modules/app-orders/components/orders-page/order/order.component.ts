import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment';

import { Order } from '../../../models/order.model';
import { OrderDetails } from '../../../models/order-details.model';
import { OrdersService } from '../../../services/orders.service';
import { OrderItem } from '../../../models/order-item.model';
import { ClientsService } from '../../../services/client.service';
import { OrderItemService } from '../../../services/order-item.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  orderDetails: OrderDetails;

  @Input() order: Order;
  @Input() productTypeList: ProductTypeResponse[];

  @Output() onChange = new EventEmitter<any>();
  @Output() onEditOpen = new EventEmitter<OrderDetails>();

  isOrderDelConfirmVisible: boolean = false;
  isOrderDeliveryConfirmVisible: boolean = false;

  constructor(
    private orderService: OrdersService,
    private clientService: ClientsService,
    private orderItemService: OrderItemService) { }

  ngOnInit() {
    this.orderDetails = this.convert(this.order);
  }

  private convert(order: Order): OrderDetails {
    let orderDetails = new OrderDetails();
    orderDetails.id = order.id;
    orderDetails.city = order.city;
    orderDetails.creationDate = order.creationDate;
    orderDetails.deliveryDate = order.deliveryDate;
    orderDetails.isImportant = order.isImportant;
    orderDetails.isDelivered = order.isDelivered;
    orderDetails.isOverdue = order.isOverdue;
    orderDetails.actualDeliveryDate = order.actualDeliveryDate;
    this.clientService.getClient(order.clientId)
      .subscribe(data => orderDetails.client = data);
    this.orderItemService.getOrderItemList(order.id)
      .subscribe(data => {
        orderDetails.orderItemList = this.sortOrderItemList(data);
      });
    return orderDetails;
  }

  private sortOrderItemList(itemList: OrderItem[]): OrderItem[] {
    const sortedOrderItemList: OrderItem[] = [];
    for (const productType of this.productTypeList) {
      let sortedItem = null;
      for (let item of itemList) {
        if (item.productTypeId === productType.id) {
          sortedItem = item;
          continue;
        }
      }
      sortedOrderItemList.push(sortedItem);
    }
    return sortedOrderItemList;
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

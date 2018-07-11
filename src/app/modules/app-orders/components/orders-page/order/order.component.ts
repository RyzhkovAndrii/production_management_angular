import { Component, OnInit, Input, EventEmitter, Output, ViewContainerRef } from '@angular/core';
import * as moment from 'moment';
import { ModalDialogService } from 'ngx-modal-dialog';

import { Order } from '../../../models/order.model';
import { OrderDetails } from '../../../models/order-details.model';
import { OrdersService } from '../../../services/orders.service';
import { OrderItem } from '../../../models/order-item.model';
import { ClientsService } from '../../../services/client.service';
import { OrderItemService } from '../../../services/order-item.service';
import { AppModalService } from '../../../../app-shared/services/app-modal.service';
import { SimpleConfirmModalComponent } from '../../../../app-shared/components/simple-confirm-modal/simple-confirm-modal.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  orderDetails: OrderDetails;

  @Input() order: Order;
  @Input() productTypeList: ProductTypeResponse[];
  @Input() ordersPageViewRef: ViewContainerRef;

  @Output() onChange = new EventEmitter<any>();
  @Output() onEditOpen = new EventEmitter<OrderDetails>();

  isOrderDeliveryConfirmVisible = false;

  constructor(
    private orderService: OrdersService,
    private clientService: ClientsService,
    private orderItemService: OrderItemService,
    private viewRef: ViewContainerRef,
    private ngxModalDialogService: ModalDialogService,
    private appModalService: AppModalService) { }

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
    this.clientService
      .getClient(order.clientId)
      .subscribe(
        data => orderDetails.client = data,
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
      );
    this.orderItemService
      .getOrderItemList(order.id)
      .subscribe(
        data => orderDetails.orderItemList = this.sortOrderItemList(data),
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
      );
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
    this.changeOrderDeliveryStatus(date);
  }

  returnOrder() {
    this.changeOrderDeliveryStatus(null);
  }

  private changeOrderDeliveryStatus(date: Date | null) {
    const { id, client, city, deliveryDate, isImportant } = this.orderDetails;
    const actualDeliveryDate = date === null ? null : moment(date).format('YYYY-MM-DD');
    const newOrder = new Order(client.id, city, deliveryDate, isImportant, actualDeliveryDate);
    this.orderService
      .update(newOrder, id)
      .subscribe(
        () => this.onChange.emit(),
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
      );
  }

  private orderDelete() {
    this.orderService
      .delete(this.orderDetails.id)
      .subscribe(
        () => this.onChange.emit(),
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
      );
  }

  openOrderDelConfirm() {
    const modalOptions = {
      title: 'Подтвердите удаление Заказа',
      childComponent: SimpleConfirmModalComponent,
      actionButtons: [
        {
          text: 'Отменить',
          buttonClass: 'btn btn-outline-dark',
          onAction: () => true
        },
        {
          text: 'Удалить',
          buttonClass: 'btn btn-danger',
          onAction: () => {
            this.orderDelete();
            return true;
          }
        }
      ]
    };
    this.ngxModalDialogService.openDialog(this.ordersPageViewRef, modalOptions);
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

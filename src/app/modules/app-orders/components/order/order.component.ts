import { Component, OnInit, Input, ViewContainerRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalDialogService } from 'ngx-modal-dialog';

import { OrderModalComponent } from '../order-modal/order-modal.component';
import { OrdersService } from '../../services/orders.service';
import { ClientsService } from '../../services/client.service';
import { OrderItemService } from '../../services/order-item.service';
import { ProductsService } from '../../../app-products/services/products.service';
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

  @Input()
  order: Order;

  isOrderDelConfirmVisible: boolean = false;

  private clientList: Client[] = [];

  private sub1: Subscription;
  private sub2: Subscription;
  private sub3: Subscription;

  constructor(private orderService: OrdersService,
    private clientService: ClientsService,
    private orderItemService: OrderItemService,
    private productService: ProductsService,
    private modalService: ModalDialogService,
    private viewRef: ViewContainerRef) { }

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
    if (this.clientList.length === 0) {
      this.sub1 = this.clientService.getAll().subscribe(data => {
        this.clientList = data;
        this._openOrderEditForm();
      });
    } else {
      this._openOrderEditForm();
    }
  }

  private _openOrderEditForm() {
    this.modalService.openDialog(this.viewRef, {
      title: 'Изменить заказ',
      childComponent: OrderModalComponent,
      data: {
        productTypeList: this.productService.getSingletonProductTypes(),
        clientList: this.clientList,
        order: this.orderDetails
      }
    })
  }

  deliverOrder() {
    const { client, city, deliveryDate, isImportant } = this.orderDetails;
    const newOrder = new Order(client.id, city, deliveryDate, isImportant, true);
    this.sub2 = this.orderService.update(newOrder, this.orderDetails.id)
      .subscribe(order => {
        // todo update orders-page
      });
  }

  private orderDelete() {
    this.sub3 = this.orderService.delete(this.orderDetails.id)
      .subscribe(() => {
        // todo update orders-page
      });
  }

  private toggleOrderDelConfirmVisibility(dir: boolean) {
    this.isOrderDelConfirmVisible = dir;
  }

  openOrderDelConfirm() {
    this.toggleOrderDelConfirmVisibility(true);
  }

  onOrderDelConfirmApply() {
    this.toggleOrderDelConfirmVisibility(false);
    this.orderDelete();
  }

  onOrderDelConfirmCancel() {
    this.toggleOrderDelConfirmVisibility(false);
  }

}

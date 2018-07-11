import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ModalDialogService } from 'ngx-modal-dialog';

import { ClientsService } from '../../services/client.service';
import { OrdersService } from '../../services/orders.service';
import { ProductsService } from '../../../app-products/services/products.service';
import { Order } from '../../models/order.model';
import { Client } from '../../models/client.model';
import { OrderDetails } from '../../models/order-details.model';
import { AppModalService } from '../../../app-shared/services/app-modal.service';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css']
})
export class OrdersPageComponent implements OnInit, OnDestroy {

  @ViewChild('lastLeftover') lastLeftover;

  orderList: Order[] = [];
  productTypes: ProductTypeResponse[] = [];
  clientList: Client[] = [];
  editedOrder: OrderDetails;

  isOrderCreateVisible: boolean = false;
  isOrderEditVisible: boolean = false;
  isClientListVisible: boolean = false;

  showDeliveredOrderStartDate: Date = null;

  ordersPageViewRef: ViewContainerRef;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private ordersService: OrdersService,
    private clientsService: ClientsService,
    private productsService: ProductsService,
    private viewRef: ViewContainerRef,
    private ngxModalDialogService: ModalDialogService,
    private appModalService: AppModalService
  ) { }

  ngOnInit() {
    this.fetchInitData();
    this.ordersPageViewRef = this.viewRef;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private fetchInitData() {
    Observable
      .forkJoin(
        this.productsService.getSortedProductTypes(),
        this.ordersService.getOrderList(),
        this.clientsService.getAll()
      )
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        data => {
          this.productTypes = data[0];
          this.orderList = data[1];
          this.clientList = data[2]; // todo load if need
        },
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
      );
  }

  private reloadOrderList() {
    if (this.showDeliveredOrderStartDate === null) {
      this.ordersService
        .getOrderList()
        .takeUntil(this.ngUnsubscribe)
        .subscribe(
          data => this.orderList = data,
          error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
        );
    } else {
      this.ordersService
        .getOrderListWithDelivered(this.showDeliveredOrderStartDate)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(
          data => this.orderList = data,
          error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
        );
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
    this.isOrderEditVisible = false;
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

  isOrderListEmpty() {
    return this.orderList.length === 0;
  }

}

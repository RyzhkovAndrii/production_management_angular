import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ModalDialogService, IModalDialogOptions } from 'ngx-modal-dialog';
import { Subscription } from 'rxjs';

import { getDate } from '../../../../app-utils/app-date-utils';
import { OrderModalComponent } from '../order-modal/order-modal.component';
import { ClientsService } from '../../services/client.service';
import { OrdersService } from '../../services/orders.service';
import { ProductsService } from '../../../app-products/services/products.service';
import { Order } from '../../models/order.model';
import { Client } from '../../models/client.model';
import { ClientPageModalComponent } from '../client-page-modal/client-page-modal.component';

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

  private sub1: Subscription;
  private sub2: Subscription;

  constructor(private ordersService: OrdersService,
    private clientsService: ClientsService,
    private productsService: ProductsService,
    private modalService: ModalDialogService,
    private viewRef: ViewContainerRef) { }

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
        this.ordersService.getOrderList())
      .subscribe(data => {
        this.productTypes = data[0];
        this.orderList = data[1];
      });
  }

  private reloadOrderList() {
    this.ordersService.getOrderList().subscribe(data => this.orderList = data);
  }

  reloadPage() {
    this.reloadOrderList();
    this.lastLeftover.reloadCurrentLeftOver();
  }

  // private _openOrderAddorEditForm() {
  //   this.modalService.openDialog(this.viewRef, {
  //     title: 'Новый заказ',
  //     childComponent: OrderModalComponent,
  //     data: {
  //       productTypeList: this.productTypes,
  //       clientList: this.clientList,
  //       order: null,
  //       viewRef: this.viewRef
  //     }
  //   })
  // }

  onOrderCreateApply(order: Order) { // todo save in array ???
    this.reloadPage();
  }

  onOrderCreateCancel() {
    this.toggleOrderCreateVisibility(false);
  }

  openOrderCreate() {
    if (this.clientList.length === 0) {
      this.sub2 = this.clientsService.getAll()
        .subscribe(data => {
          this.clientList = data;
          this.toggleOrderCreateVisibility(true);
        });
    } else {
      this.toggleOrderCreateVisibility(true);
    }
  }

  private toggleOrderCreateVisibility(dir: boolean) {
    this.isOrderCreateVisible = dir;
  }

}

import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, ChangeDetectorRef, ViewChildren, QueryList, TemplateRef, ElementRef, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ModalDialogService } from 'ngx-modal-dialog';

import { ClientsService } from '../../services/client.service';
import { OrdersService, FIXED_HEADER_TOP_POSITION } from '../../services/orders.service';
import { ProductsService } from '../../../app-products/services/products.service';
import { Order } from '../../models/order.model';
import { Client } from '../../models/client.model';
import { OrderDetails } from '../../models/order-details.model';
import { AppModalService } from '../../../app-shared/services/app-modal.service';
import { Title } from '@angular/platform-browser';
import { OrderComponent } from './order/order.component';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css']
})
export class OrdersPageComponent implements OnInit, OnDestroy {

  @ViewChild('lastLeftover') lastLeftover;
  @ViewChild('modification') modification;

  @ViewChildren(OrderComponent) orders: QueryList<any>;
  @ViewChild('table') table: ElementRef;
  @ViewChild('fixedHeader') fixedHeader: ElementRef;
  @ViewChild('orderTableContainer') orderTableContainer: ElementRef;

  orderList: Order[] = [];
  productTypes: ProductTypeResponse[] = [];
  clientList: Client[] = null;
  editedOrder: OrderDetails;

  isOrderCreateVisible = false;
  isOrderEditVisible = false;
  isClientListVisible = false;
  isDataLoaded = false;

  showDeliveredOrderStartDate: Date = null;
  hideFixedHeader = true;
  showOrderTableScrollButtons = true;
  xPosOrderTableContainer: number;

  ordersPageViewRef: ViewContainerRef;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private ordersService: OrdersService,
    private clientsService: ClientsService,
    private productsService: ProductsService,
    private viewRef: ViewContainerRef,
    private ngxModalDialogService: ModalDialogService,
    private appModalService: AppModalService,
    private title: Title
  ) {
    this.title.setTitle('Заказы');
  }

  ngOnInit() {
    this.fetchInitData();
    this.ordersPageViewRef = this.viewRef;
  }

  onOrderTableScroll() {
    this.orders.toArray().forEach(orderElement =>
      orderElement.xPos = orderElement.viewRef.element.nativeElement.getBoundingClientRect().left);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const tableOffset = this.table.nativeElement.getBoundingClientRect().top;
    this.hideFixedHeader = (tableOffset > FIXED_HEADER_TOP_POSITION);
  }

  // @HostListener('window:resize', ['$event'])
  // onResize() {
  //   this.toggleOrderTableScrollButtons();
  // }

  changeLeft() {
    this.orderTableContainer.nativeElement.scrollTo({ left: (this.orderTableContainer.nativeElement.scrollLeft - 100), behavior: 'smooth' });
  }

  changeRight() {
    this.orderTableContainer.nativeElement.scrollTo({ left: (this.orderTableContainer.nativeElement.scrollLeft + 100), behavior: 'smooth' });
  }

  // toggleOrderTableScrollButtons() {
  //   this.showOrderTableScrollButtons = (this.orderTablecontainer.nativeElement.scrollWidth > this.orderTablecontainer.nativeElement.offsetWidth);
  // }

  private fetchInitData() {
    Observable
      .forkJoin(
        this.productsService.getSortedProductTypes(),
        this.ordersService.getOrderList()
      )
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        data => {
          this.productTypes = data[0];
          this.orderList = data[1];
          this.isDataLoaded = true;
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
          data => {
            this.orderList = data;
          },
          error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
        );
    } else {
      this.ordersService
        .getOrderListWithDelivered(this.showDeliveredOrderStartDate)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(
          data => {
            this.orderList = data;
          },
          error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
        );
    }
  }

  reloadPage() {
    this.reloadOrderList();
    this.modification.reload();
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
    this.fetchClientList(() => this.isOrderCreateVisible = true);
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
    this.fetchClientList(() => this.isOrderEditVisible = true);
  }

  openClientList() {
    this.fetchClientList(() => this.isClientListVisible = true);
  }

  onClientListCancel() {
    this.isClientListVisible = false;
  }

  isOrderListEmpty() {
    return this.orderList.length === 0;
  }

  private fetchClientList(openWindow: Function) {
    if (this.clientList === null) {
      this.clientsService
        .getAll()
        .subscribe(
          data => {
            this.clientList = data;
            openWindow();
          },
          error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
        );
    } else {
      openWindow();
    }
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OrdersService } from '../../services/orders.service';
import { ClientsService } from '../../services/client.service';
import { OrderItemService } from '../../services/order-item.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  order = {} as OrderDetails;

  @Input()
  orderResponse: OrderResponse;

  @Input()
  productTypeList: ProductTypeResponse[];

  constructor(private orderService: OrdersService,
    private clientService: ClientsService,
    private orderItemService: OrderItemService) { }

  ngOnInit() {
    this.convert();
  }

  private convert() {
    this.order.id = this.orderResponse.id;
    this.order.city = this.orderResponse.city;
    this.order.creationDate = this.orderResponse.creationDate;
    this.order.deliveryDate = this.orderResponse.deliveryDate;
    this.order.isImportant = this.orderResponse.isImportant;
    this.order.isDelivered = this.orderResponse.isDelivered;
    this.order.isOverdue = this.orderResponse.isOverdue;
    this.clientService.getClient(this.orderResponse.clientId)
      .subscribe(client => this.order.client = client);
    this.orderItemService.getOrderItemList(this.orderResponse.id)
      .subscribe(orderItemList => {
        this.order.orderItemList = orderItemList;
        this.sortOrderItemList();
      });
  }


  private sortOrderItemList() {
    const filledOrderItemList: OrderItemResponse[] = [];
    for (let productType of this.productTypeList) {
      let item = null;
      for (let orderItem of this.order.orderItemList) {
        if (orderItem.productTypeId === productType.id) {
          item = orderItem;
          continue;
        }
      }
      filledOrderItemList.push(item);
    }
    this.order.orderItemList = filledOrderItemList;
  }

}

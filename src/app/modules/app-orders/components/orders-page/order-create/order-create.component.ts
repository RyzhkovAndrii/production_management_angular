import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Client } from '../../../models/client.model';
import { OrderItem } from '../../../models/order-item.model';
import { Order } from '../../../models/order.model';
import { OrdersService } from '../../../services/orders.service';
import { OrderItemService } from '../../../services/order-item.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css']
})
export class OrderCreateComponent {

  private order: Order;
  newItemList: OrderItem[] = [];

  @Input()
  productTypeList: ProductTypeResponse[];

  @Input()
  clientList: Client[];

  @Output()
  onSubmit = new EventEmitter<Order>();

  @Output()
  onCancel = new EventEmitter<any>();

  form: FormGroup = new FormGroup({
    "client": new FormControl(null, [Validators.required]),
    "city": new FormControl(null, [Validators.required]),
    "date": new FormControl(null, [Validators.required]),
    "important": new FormControl(false, []),
    "itemType": new FormControl(null, []),
    "itemAmount": new FormControl(null, [])
  });

  isCreated: boolean = false;

  constructor(
    private orderService: OrdersService,
    private orderItemService: OrderItemService
  ) { }

  submit() {
    const { client, city, date, important } = this.form.value;
    let order = new Order(client, city, date, important, false);
    this.orderService.save(order)
      .subscribe(order => {
        this.newItemList.forEach(item => item.orderId = order.id);
        this.orderItemService.saveOrderItemList(this.newItemList).subscribe(() => {
          this.onSubmit.emit(order);
          this.form.reset();
          this.newItemList = [];
          this.showCreateMessage();
        });
      });

  }

  cancel() {
    this.onCancel.emit();
  }

  openClientPage() {

  }

  addNewItem() {
    const { itemType, itemAmount } = this.form.value;
    const item = new OrderItem(null, itemType, itemAmount);
    this.newItemList.push(item);
    this.resetAddOrderItemForm();
  }

  removeNewItem(i: number) {
    this.newItemList.splice(i, 1);
  }

  getProductTypeName(pruductTypeId: number): string { // todo field (not method)
    return this.productTypeList.find((productType) => productType.id === pruductTypeId).name;
  }

  private resetAddOrderItemForm() {
    this.form.get("itemType").reset();
    this.form.get("itemAmount").reset();
  }

  private showCreateMessage() {
    this.isCreated = true;
    window.setTimeout(() => this.isCreated = false, 5000);
  }

}

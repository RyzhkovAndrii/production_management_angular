import { Component, OnInit, ComponentRef, Input, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IModalDialog, IModalDialogOptions, IModalDialogButton, ModalDialogService } from 'ngx-modal-dialog';

import { OrdersService } from '../../services/orders.service';
import { OrderDetails } from '../../models/order-details.model';
import { Order } from '../../models/order.model';
import { Client } from '../../models/client.model';
import { ClientPageModalComponent } from '../client-page-modal/client-page-modal.component';
import { Subscription } from 'rxjs';
import { OrderItem } from '../../models/order-item.model';
import { OrderItemService } from '../../services/order-item.service';

@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.css']
})
export class OrderModalComponent implements IModalDialog {

  form: FormGroup = new FormGroup({
    "client": new FormControl(null, [Validators.required]),
    "city": new FormControl(null, [Validators.required]),
    "date": new FormControl(null, [Validators.required]),
    "important": new FormControl(false, []),
    "itemType": new FormControl(null, []),
    "itemAmount": new FormControl(null, [])
  });;

  actionButtons: IModalDialogButton[];

  productTypeList: ProductTypeResponse[];

  clientList: Client[];

  order: OrderDetails;

  newItemList: OrderItem[] = [];

  private orderPageViewRef: ViewContainerRef;

  // @Output()
  // onOrderCreateOrEdit = new EventEmitter<Order>();

  constructor( // todo unsubscribe
    private orderService: OrdersService,
    private orderItemService: OrderItemService,
    private modalService: ModalDialogService,
    private viewRef: ViewContainerRef
  ) {
    this.actionButtons = [
      {
        text: "Отмена",
        buttonClass: "btn btn-outline-dark",
        onAction: () => true
      },
      {
        text: "Сохранить",
        buttonClass: "btn btn-outline-dark",
        onAction: this.onSubmit.bind(this)
      }
    ]
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.productTypeList = options.data.productTypeList;
    this.clientList = options.data.clientList;
    this.order = options.data.order;
    this.orderPageViewRef = options.data.viewRef;
    if (this.order !== null) {
      this.form.get("client").setValue(this.order.client.id);
      this.form.get("city").setValue(this.order.city);
      this.form.get("date").setValue(this.order.deliveryDate);
      this.form.get("important").setValue(this.order.isImportant);
    }
  }

  onSubmit() {
    const { client, city, date, important } = this.form.value;
    let newOrder = new Order(client, city, date, important, false)
    if (this.order === null) {
      this.orderService.save(newOrder)
        .subscribe(order => {
          newOrder = order;
          this.newItemList.forEach(item => item.orderId = order.id);
          this.newItemList
            .forEach(item => this.orderItemService.saveOrderItem(item).subscribe()); // todo on list metod (look on next line)
          // this.orderItemService.saveOrderItemList(this.newItemList).subscribe(); // todo REST for this method
        });
    } else {
      this.orderService.update(newOrder, this.order.id).subscribe(order => newOrder = order);
    }
    // this.onOrderCreateOrEdit.emit(newOrder);
    return Promise.resolve(newOrder); // todo ???
  }

  openClientPage() { // todo form not opening
    this.modalService.openDialog(this.orderPageViewRef, {
      title: 'Список клиентов',
      childComponent: ClientPageModalComponent,
      data: {
        clientList: this.clientList
      }
    })
  }

  addNewItem() {
    const { itemType, itemAmount } = this.form.value;
    const item = new OrderItem(null, itemType, itemAmount);
    this.newItemList.push(item);
    this.resetAddOrderItemForm();
  }

  private resetAddOrderItemForm() {
    this.form.get("itemType").setValue("");
    this.form.get("itemType").markAsUntouched();
    this.form.get("itemAmount").setValue(0.001);
    this.form.get("itemAmount").markAsUntouched();
  }

  removeNewItem(i: number) {
    this.newItemList.splice(i, 1);
  }

  getProductTypeName(pruductTypeId: number): string { // todo field (not method)
    console.log("getName");
    return this.productTypeList.find((productType) => productType.id === pruductTypeId).name;
  }

}

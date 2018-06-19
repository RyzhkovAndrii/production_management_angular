import { Component, EventEmitter, Output, Input, OnInit, Pipe, PipeTransform, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Client } from '../../../models/client.model';
import { OrderItem } from '../../../models/order-item.model';
import { Order } from '../../../models/order.model';
import { OrdersService } from '../../../services/orders.service';
import { OrderItemService } from '../../../services/order-item.service';
import Decimal from 'decimal.js';
import { validateDecimalPlaces } from '../../../../../app-utils/app-validators';

const MIN_PRODUCT_AMOUNT = 0.001;
const DECIMAL_PLACES = 3; // todo common option

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css']
})
export class OrderCreateComponent implements OnInit {

  newItemDetailsList: { productType: ProductTypeResponse, amount: number }[] = [];

  @Input()
  productTypeList: ProductTypeResponse[];
  currentProductTypeList: ProductTypeResponse[];

  @Input()
  clientList: Client[];

  @Output()
  onSubmit = new EventEmitter<Order>();

  @Output()
  onCancel = new EventEmitter<any>();

  @Output()
  onClientListOpen = new EventEmitter<any>();

  form: FormGroup = new FormGroup({
    "client": new FormControl(null, [Validators.required]),
    "city": new FormControl(null, [Validators.required]),
    "date": new FormControl(null, [Validators.required]),
    "important": new FormControl(false, []),
    "itemType": new FormControl(null, [Validators.required]),
    "itemAmount": new FormControl(null, [Validators.required, Validators.min(MIN_PRODUCT_AMOUNT), validateDecimalPlaces])
  });

  isCreated: boolean = false;
  showAddOrderItemErrors = false;

  constructor(
    private orderService: OrdersService,
    private orderItemService: OrderItemService
  ) { }

  ngOnInit() {
    this.currentProductTypeList = this.productTypeList;
  }

  submit() {
    const { client, city, date, important } = this.form.value;
    let order = new Order(client, city, date, important, false);
    let newItemList: OrderItem[] = [];
    this.orderService.save(order)
      .subscribe(order => { // todo some exception if order was not created
        this.newItemDetailsList.forEach(itemDetails => {
          const item: OrderItem = new OrderItem(order.id, itemDetails.productType.id, itemDetails.amount);
          newItemList.push(item);
        })
        this.orderItemService.saveOrderItemList(newItemList).subscribe((itemList) => {
          this.form.reset();
          this.newItemDetailsList = [];
          this.currentProductTypeList = this.productTypeList;
          this.showCreateMessage();
          this.onSubmit.emit(order);
        });
      });
  }

  cancel() {
    this.onCancel.emit();
  }

  openClientList() {
    this.onClientListOpen.emit();
  }

  addNewItem() {
    if (this.isAddOrderItemFormInvalid()) {
      this.showAddOrderItemErrors = true;
      this.setAddOrderItemFormPristine();
    } else {
      this.showAddOrderItemErrors = false;
      const { itemType, itemAmount } = this.form.value;
      const productType: ProductTypeResponse = this.productTypeList.find(type => type.id === itemType);
      const integerItemAmount = new Decimal(itemAmount).times(Math.pow(10, DECIMAL_PLACES)).toNumber();
      const itemDetails = { "productType": productType, "amount": integerItemAmount };
      this.newItemDetailsList.push(itemDetails);
      this.currentProductTypeList = this.currentProductTypeList.filter(type => type.id !== itemType);
      this.resetAddOrderItemForm();
    }
  }

  removeNewItem(i: number) {
    const removedItem = this.newItemDetailsList.splice(i, 1)[0];
    this.currentProductTypeList.push(removedItem.productType);
    this.resetAddOrderItemForm(); // todo RESET select-list
  }

  private resetAddOrderItemForm() {
    this.form.get("itemType").reset();
    this.form.get("itemAmount").reset();
  }

  private setAddOrderItemFormPristine() {
    this.form.get("itemType").markAsPristine();
    this.form.get("itemAmount").markAsPristine();
  }

  private isAddOrderItemFormInvalid() {
    return this.form.get("itemType").invalid || this.form.get("itemAmount").invalid;
  }

  private showCreateMessage() {
    this.isCreated = true;
    window.setTimeout(() => this.isCreated = false, 5000);
  }

}

import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Decimal from 'decimal.js';

import { Client } from '../../../models/client.model';
import { OrderDetails } from '../../../models/order-details.model';
import { Order } from '../../../models/order.model';
import { OrdersService } from '../../../services/orders.service';
import { OrderItemService } from '../../../services/order-item.service';
import { OrderItem } from '../../../models/order-item.model';
import { validateDecimalPlaces } from '../../../../../app-utils/app-validators';

const MIN_PRODUCT_AMOUNT = 0.001;
const DECIMAL_PLACES = 3; // todo common option

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css']
})
export class OrderEditComponent implements OnInit {

  @Input() productTypeList: ProductTypeResponse[];
  @Input() clientList: Client[];
  @Input() order: OrderDetails;

  productTypeListForSelect: ProductTypeResponse[];

  newItemDetailsList: { productType: ProductTypeResponse, amount: number }[] = [];
  oldItemDetailsList: { productType: ProductTypeResponse, amount: number }[] = [];

  @ViewChild('productTypeSelect') productTypeSelect: NgSelectComponent;

  @Output() onSubmit = new EventEmitter<Order>();
  @Output() onCancel = new EventEmitter<any>();

  form: FormGroup;

  isEdited: boolean = false;
  showAddOrderItemErrors = false;

  constructor(
    private orderService: OrdersService,
    private orderItemService: OrderItemService
  ) { }

  ngOnInit() {
    this.productTypeListForSelect = this.productTypeList;
    this.form = new FormGroup({
      "client": new FormControl(this.order.client.id, [Validators.required]),
      "city": new FormControl(this.order.city, [Validators.required]),
      "date": new FormControl(this.order.deliveryDate, [Validators.required]),
      "important": new FormControl(this.order.isImportant, []),
      "productType": new FormControl(null, [Validators.required]),
      "itemAmount": new FormControl(null, [Validators.required, Validators.min(MIN_PRODUCT_AMOUNT), validateDecimalPlaces])
    });
    this.fillOldOrderItemList();
  }

  private fillOldOrderItemList() {
    if (this.order.orderItemList !== null) {
      this.order.orderItemList.forEach(orderItem => {
        if (orderItem !== null) {
          const productTypeDetails: ProductTypeResponse = this.productTypeList.find(type => type.id === orderItem.productTypeId);
          this.oldItemDetailsList.push({ "productType": productTypeDetails, "amount": orderItem.amount });
          this.productTypeListForSelect = this.productTypeListForSelect.filter(type => type.id !== productTypeDetails.id);
        }
      })
    }
  }

  submit() {
    const { client, city, date, important } = this.form.value;
    let order = new Order(client, city, date, important, false);
    // let newItemList: OrderItem[] = [];
    this.orderService.update(order, this.order.id).subscribe((order) => {
      this.showEditMessage();
      this.onSubmit.emit(order);
    });
    //   .subscribe(order => { // todo some exception if order was not created
    //   this.newItemDetailsList.forEach(itemDetails => {
    //     const item: OrderItem = new OrderItem(order.id, itemDetails.productType.id, itemDetails.amount);
    //     newItemList.push(item);
    //   })
    //   this.orderItemService.saveOrderItemList(newItemList).subscribe(() => {
    //     this.form.reset();
    //     this.newItemDetailsList = [];
    //     this.productTypeListForSelect = this.productTypeList;
    //     this.showEditMessage();
    //     this.onSubmit.emit(order);
    //   });
    // });
  }

  cancel() {
    this.onCancel.emit();
  }

  addNewItem() {
    if (this.isAddOrderItemFormInvalid()) {
      this.showAddOrderItemErrors = true;
      this.setAddOrderItemFormPristine();
    } else {
      this.showAddOrderItemErrors = false;
      const { productType, itemAmount } = this.form.value;
      const productTypeDetails: ProductTypeResponse = this.productTypeList.find(type => type.id === productType);
      const integerItemAmount = new Decimal(itemAmount).times(Math.pow(10, DECIMAL_PLACES)).toNumber();
      const itemDetails = { "productType": productTypeDetails, "amount": integerItemAmount };
      this.newItemDetailsList.push(itemDetails);
      this.removeOptionFromProductTypeSelect(itemDetails.productType);
      this.resetAddOrderItemForm();
    }
  }

  removeNewItem(i: number) {
    const removedItem = this.newItemDetailsList.splice(i, 1)[0];
    this.addOptionToProductTypeSelect(removedItem.productType);
    this.resetAddOrderItemForm();
  }

  removeOldItem(i: number) {
    const removedItem = this.oldItemDetailsList.splice(i, 1)[0];
    this.addOptionToProductTypeSelect(removedItem.productType);
    this.resetAddOrderItemForm();
  }

  editOldItem(i: number) {
    // todo
  }

  private addOptionToProductTypeSelect(productType: ProductTypeResponse) {
    this.productTypeListForSelect.push(productType);
    this.productTypeSelect.itemsList.setItems(this.productTypeListForSelect);
  }

  private removeOptionFromProductTypeSelect(productType: ProductTypeResponse) {
    this.productTypeListForSelect = this.productTypeListForSelect.filter(type => type.id !== productType.id);
    this.productTypeSelect.itemsList.setItems(this.productTypeListForSelect);
  }

  private resetAddOrderItemForm() {
    this.form.get("productType").reset();
    this.form.get("itemAmount").reset();
  }

  private setAddOrderItemFormPristine() {
    this.form.get("productType").markAsPristine();
    this.form.get("itemAmount").markAsPristine();
  }

  private isAddOrderItemFormInvalid() {
    return this.form.get("productType").invalid || this.form.get("itemAmount").invalid;
  }

  private showEditMessage() {
    this.isEdited = true;
    window.setTimeout(() => this.isEdited = false, 5000);
  }


}
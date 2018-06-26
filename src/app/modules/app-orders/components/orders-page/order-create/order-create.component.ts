import { Component, EventEmitter, Output, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Decimal from 'decimal.js';

import { Client } from '../../../models/client.model';
import { OrderItem } from '../../../models/order-item.model';
import { Order } from '../../../models/order.model';
import { OrdersService } from '../../../services/orders.service';
import { OrderItemService } from '../../../services/order-item.service';
import { validateDecimalPlaces } from '../../../../../app-utils/app-validators';
import { NgSelectComponent } from '@ng-select/ng-select';

const MIN_PRODUCT_AMOUNT = 0.001;
const DECIMAL_PLACES = 3; // todo common option

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css']
})
export class OrderCreateComponent implements OnInit {

  newItemDetailsList: { productType: ProductTypeResponse, amount: number }[] = [];

  @ViewChild('productTypeSelect') productTypeSelect: NgSelectComponent;

  @Input() productTypeList: ProductTypeResponse[];
  @Input() clientList: Client[];

  productTypeListForSelect: ProductTypeResponse[];

  @Output() onSubmit = new EventEmitter<Order>();
  @Output() onCancel = new EventEmitter<any>();

  form: FormGroup = new FormGroup({
    "client": new FormControl(null, [Validators.required]),
    "city": new FormControl(null, [Validators.required]),
    "date": new FormControl(null, [Validators.required]),
    "important": new FormControl(false, []),
    "productType": new FormControl(null, [Validators.required]),
    "itemAmount": new FormControl(null, [Validators.required, Validators.min(MIN_PRODUCT_AMOUNT), validateDecimalPlaces])
  });

  isCreated: boolean = false;
  showAddOrderItemErrors = false;

  constructor(
    private orderService: OrdersService,
    private orderItemService: OrderItemService
  ) { }

  ngOnInit() {
    this.productTypeListForSelect = this.productTypeList;
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
        this.orderItemService.saveOrderItemList(newItemList)
          .subscribe(() => {
            this.form.reset();
            this.newItemDetailsList = [];
            this.productTypeListForSelect = this.productTypeList;
            this.showCreateMessage();
            this.onSubmit.emit(order);
          });
      });
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
      this.removeOptionFromProductTypeSelect(itemDetails);
      this.resetAddOrderItemForm();
    }
  }

  removeNewItem(i: number) {
    const removedItem = this.newItemDetailsList.splice(i, 1)[0];
    this.addOptionToProductTypeSelect(removedItem);
    this.resetAddOrderItemForm();
  }

  private addOptionToProductTypeSelect(item: { productType: ProductTypeResponse, amount: number }) {
    this.productTypeListForSelect.push(item.productType);
    this.productTypeSelect.itemsList.setItems(this.productTypeListForSelect);
  }

  private removeOptionFromProductTypeSelect(item: { productType: ProductTypeResponse, amount: number }) {
    this.productTypeListForSelect = this.productTypeListForSelect.filter(type => type.id !== item.productType.id);
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

  private showCreateMessage() {
    this.isCreated = true;
    window.setTimeout(() => this.isCreated = false, 5000);
  }

}

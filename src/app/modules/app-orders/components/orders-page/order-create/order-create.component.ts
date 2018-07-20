import { Component, EventEmitter, Output, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Decimal from 'decimal.js';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ModalDialogService } from 'ngx-modal-dialog';

import { Client } from '../../../models/client.model';
import { OrderItem } from '../../../models/order-item.model';
import { Order } from '../../../models/order.model';
import { OrdersService } from '../../../services/orders.service';
import { OrderItemService } from '../../../services/order-item.service';
import { validateDecimalPlaces } from '../../../../../app-utils/app-validators';
import { AppModalService } from '../../../../app-shared/services/app-modal.service';
import { compareProductTypes } from '../../../../../app-utils/app-comparators';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css']
})
export class OrderCreateComponent implements OnInit {
  
  readonly MIN_PRODUCT_AMOUNT = 0.001;
  readonly DECIMAL_PLACES = 3; // todo common option
  readonly NAME_MAX_LENGTH = 50;

  newItemDetailsList: { productType: ProductTypeResponse, amount: number }[] = [];

  @ViewChild('productTypeSelect') productTypeSelect: NgSelectComponent;

  @Input() productTypeList: ProductTypeResponse[];
  @Input() clientList: Client[];

  productTypeListForSelect: ProductTypeResponse[];

  @Output() onSubmit = new EventEmitter<Order>();
  @Output() onCancel = new EventEmitter<any>();

  form: FormGroup = new FormGroup({
    "client": new FormControl(null, [Validators.required]),
    "city": new FormControl(null, [Validators.required, Validators.maxLength(this.NAME_MAX_LENGTH)]),
    "date": new FormControl(null, [Validators.required]),
    "important": new FormControl(false, []),
    "productType": new FormControl(null, [Validators.required]),
    "itemAmount": new FormControl(null, [Validators.required, Validators.min(this.MIN_PRODUCT_AMOUNT), validateDecimalPlaces]),
    "editedItemAmount": new FormControl(null, [Validators.required, Validators.min(this.MIN_PRODUCT_AMOUNT), validateDecimalPlaces])
  });

  isCreated: boolean = false;
  showAddOrderItemErrors = false;
  editedNewItemIndex: number = -1;

  constructor(
    private orderService: OrdersService,
    private orderItemService: OrderItemService,
    private viewRef: ViewContainerRef,
    private ngxModalDialogService: ModalDialogService,
    private appModalService: AppModalService
  ) { }

  ngOnInit() {
    this.productTypeListForSelect = this.productTypeList;
  }

  submit() {
    const { client, city, date, important } = this.form.value;
    let order = new Order(client, city, date, important, null);
    let newItemList: OrderItem[] = [];
    this.orderService
      .save(order)
      .subscribe(
        order => {
          this.newItemDetailsList
            .forEach(itemDetails => {
              const item: OrderItem = new OrderItem(order.id, itemDetails.productType.id, itemDetails.amount);
              newItemList.push(item);
            })
          this.orderItemService
            .saveOrderItemList(newItemList)
            .subscribe(
              () => {
                this.resetForm();
                this.newItemDetailsList = [];
                this.productTypeListForSelect = this.productTypeList;
                this.showCreateMessage();
                this.onSubmit.emit(order);
              },
              error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
            );
        },
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
      );
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
      const integerItemAmount = new Decimal(itemAmount).times(Math.pow(10, this.DECIMAL_PLACES)).toNumber();
      const itemDetails = { "productType": productTypeDetails, "amount": integerItemAmount };
      this.newItemDetailsList.push(itemDetails);
      this.removeOptionFromProductTypeSelect(itemDetails);
      this.resetAddOrderItemForm();
    }
  }

  editNewItem(i: number) {
    this.editedNewItemIndex = i;
    this.form.get("editedItemAmount").markAsDirty();
  }

  submitEditNewItem() {
    if (this.form.get("editedItemAmount").invalid) {
      this.form.get("editedItemAmount").markAsPristine();
    } else {
      const { editedItemAmount } = this.form.value;
      const integerItemAmount = new Decimal(editedItemAmount).times(Math.pow(10, this.DECIMAL_PLACES)).toNumber();
      this.newItemDetailsList[this.editedNewItemIndex].amount = integerItemAmount;
      this.editedNewItemIndex = -1;
    }
  }

  cancelEditNewItem() {
    this.editedNewItemIndex = -1;
  }

  removeNewItem(i: number) {
    const removedItem = this.newItemDetailsList.splice(i, 1)[0];
    this.addOptionToProductTypeSelect(removedItem);
    this.resetAddOrderItemForm();
  }

  private addOptionToProductTypeSelect(item: { productType: ProductTypeResponse, amount: number }) {
    this.productTypeListForSelect.push(item.productType);
    this.productTypeListForSelect.sort(compareProductTypes);
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

  private resetForm() {
    this.form.reset();
    this.form.get('important').patchValue(false);
  }

}

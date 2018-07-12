import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDialogService } from 'ngx-modal-dialog';
import Decimal from 'decimal.js';

import { Client } from '../../../models/client.model';
import { OrderDetails } from '../../../models/order-details.model';
import { Order } from '../../../models/order.model';
import { OrdersService } from '../../../services/orders.service';
import { OrderItemService } from '../../../services/order-item.service';
import { OrderItem } from '../../../models/order-item.model';
import { validateDecimalPlaces } from '../../../../../app-utils/app-validators';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
import { AppModalService } from '../../../../app-shared/services/app-modal.service';
import { SimpleConfirmModalComponent } from '../../../../app-shared/components/simple-confirm-modal/simple-confirm-modal.component';
import { compareProductTypes } from '../../../../../app-utils/app-comparators';

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

  @Input() ordersPageViewRef: ViewContainerRef;

  productTypeListForSelect: ProductTypeResponse[];

  newItemDetailsList: { productType: ProductTypeResponse, amount: number }[] = [];
  oldItemDetailsList: { id: number, productType: ProductTypeResponse, amount: number }[] = [];
  itemDetailsListForEdit: { id: number, productType: ProductTypeResponse, amount: number }[] = [];
  itemIdListForRemove: number[] = [];


  @ViewChild('productTypeSelect') productTypeSelect: NgSelectComponent;

  @Output() onSubmit = new EventEmitter<Order>();
  @Output() onCancel = new EventEmitter<any>();

  form: FormGroup;

  isEdited: boolean = false;
  showAddOrderItemErrors = false;
  editedNewItemIndex = -1;
  editedOldItemIndex = -1;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private orderService: OrdersService,
    private orderItemService: OrderItemService,
    private viewRef: ViewContainerRef,
    private ngxModalDialogService: ModalDialogService,
    private appModalService: AppModalService
  ) { }

  ngOnInit() {
    this.productTypeListForSelect = this.productTypeList;
    this.form = new FormGroup({
      "client": new FormControl(this.order.client.id, [Validators.required]),
      "city": new FormControl(this.order.city, [Validators.required]),
      "date": new FormControl(this.order.deliveryDate, [Validators.required]),
      "important": new FormControl(this.order.isImportant, []),
      "productType": new FormControl(null, [Validators.required]),
      "itemAmount": new FormControl(null, [Validators.required, Validators.min(MIN_PRODUCT_AMOUNT), validateDecimalPlaces]),
      "editedItemAmount": new FormControl(null, [Validators.required, Validators.min(MIN_PRODUCT_AMOUNT), validateDecimalPlaces])
    });
    this.fillOldOrderItemList();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  submit() {
    this.orderService
      .update(this.getOrderForUpdate(), this.order.id)
      .subscribe(
        order => {
          this.orderItemService
            .removeListByIds(this.itemIdListForRemove)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
              () => {
                this.itemIdListForRemove = [];
                Observable
                  .forkJoin(
                    this.orderItemService.updateOrderItemList(this.getOrderItemsForEdit()),
                    this.orderItemService.saveOrderItemList(this.getOrderItemsForSave())
                  )
                  .takeUntil(this.ngUnsubscribe)
                  .subscribe(
                    () => {
                      this.itemDetailsListForEdit = [];
                      this.newItemDetailsList = [];
                      this.openOrderEditSuccess();
                      this.onSubmit.emit(order);
                    },
                    error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
                  )
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
      const integerItemAmount = new Decimal(itemAmount).times(Math.pow(10, DECIMAL_PLACES)).toNumber();
      const itemDetails = { "productType": productTypeDetails, "amount": integerItemAmount };
      this.newItemDetailsList.push(itemDetails);
      this.removeOptionFromProductTypeSelect(itemDetails.productType);
      this.resetAddOrderItemForm();
    }
  }

  editNewItemOnForm(i: number) {
    this.editedNewItemIndex = i;
    this.editedOldItemIndex = -1;
    this.form.get("editedItemAmount").markAsDirty();
  }

  editOldItemOnForm(i: number) {
    this.editedOldItemIndex = i;
    this.editedNewItemIndex = -1
    this.form.get("editedItemAmount").markAsDirty();
  }

  removeNewItemFromForm(i: number) {
    const removedItem = this.newItemDetailsList.splice(i, 1)[0];
    this.addOptionToProductTypeSelect(removedItem.productType);
  }

  removeOldItemFromForm(i: number) {
    const removedItem = this.oldItemDetailsList.splice(i, 1)[0];
    this.addOptionToProductTypeSelect(removedItem.productType);
    this.itemIdListForRemove.push(removedItem.id);
  }

  submitEditNewItem() {
    if (this.form.get("editedItemAmount").invalid) {
      this.form.get("editedItemAmount").markAsPristine();
    } else {
      const { editedItemAmount } = this.form.value;
      const integerItemAmount = new Decimal(editedItemAmount).times(Math.pow(10, DECIMAL_PLACES)).toNumber();
      this.newItemDetailsList[this.editedNewItemIndex].amount = integerItemAmount;
      this.editedNewItemIndex = -1;
    }
  }

  submitEditOldItem() {
    if (this.form.get("editedItemAmount").invalid) {
      this.form.get("editedItemAmount").markAsPristine();
    } else {
      const { editedItemAmount } = this.form.value;
      const integerItemAmount = new Decimal(editedItemAmount).times(Math.pow(10, DECIMAL_PLACES)).toNumber();
      this.oldItemDetailsList[this.editedOldItemIndex].amount = integerItemAmount;
      this.itemDetailsListForEdit.push(this.oldItemDetailsList[this.editedOldItemIndex]);
      this.editedOldItemIndex = -1;
    }
  }

  cancelEditItem() {
    this.editedNewItemIndex = -1;
    this.editedOldItemIndex = -1;
  }

  private openOrderEditSuccess() {
    const modalOptions = {
      title: 'Заказ успешно обновлен',
      childComponent: SimpleConfirmModalComponent,
      actionButtons: [
        {
          text: 'OK',
          buttonClass: 'btn btn-outline-dark',
          onAction: () => true
        }
      ]
    };
    this.ngxModalDialogService.openDialog(this.ordersPageViewRef, modalOptions);
  }

  private fillOldOrderItemList() {
    if (this.order.orderItemList !== null) {
      this.order.orderItemList.forEach(orderItem => {
        if (orderItem !== null) {
          const productTypeDetails: ProductTypeResponse = this.productTypeList.find(type => type.id === orderItem.productTypeId);
          this.oldItemDetailsList.push({ "id": orderItem.id, "productType": productTypeDetails, "amount": orderItem.amount });
          this.productTypeListForSelect = this.productTypeListForSelect.filter(type => type.id !== productTypeDetails.id);
        }
      })
    }
  }

  private getOrderForUpdate(): Order {
    const { client, city, date, important } = this.form.value;
    const order = new Order(
      client,
      city,
      date,
      important,
      this.order.actualDeliveryDate
    );
    return order;
  }

  private getOrderItemsForSave(): OrderItem[] {
    let newItemList: OrderItem[] = [];
    this.newItemDetailsList
      .forEach(itemDetails => {
        const item: OrderItem = new OrderItem(this.order.id, itemDetails.productType.id, itemDetails.amount);
        newItemList.push(item);
      });
    return newItemList;
  }

  private getOrderItemsForEdit(): OrderItem[] {
    let editedItemList: OrderItem[] = [];
    this.itemDetailsListForEdit
      .forEach(itemDetails => {
        const item: OrderItem = new OrderItem(
          this.order.id,
          itemDetails.productType.id,
          itemDetails.amount,
          itemDetails.id);
        editedItemList.push(item);
      });
    return editedItemList;
  }

  private addOptionToProductTypeSelect(productType: ProductTypeResponse) {
    this.productTypeListForSelect.push(productType);
    this.productTypeListForSelect.sort(compareProductTypes);
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

}

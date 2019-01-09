import {
  Component,
  OnInit,
  ComponentRef
} from '@angular/core';
import {
  IModalDialog,
  IModalDialogOptions,
  IModalDialogButton
} from 'ngx-modal-dialog';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import {
  Decimal
} from 'decimal.js'

import {
  ProductOperationType
} from '../../enums/product-operation-type.enum';
import {
  newDecimalPlacesValidator
} from '../../../../app-utils/app-validators';

@Component({
  selector: 'app-product-operation-modal',
  templateUrl: './product-operation-modal.component.html',
  styleUrls: ['./product-operation-modal.component.css']
})
export class ProductOperationModalComponent implements OnInit, IModalDialog {

  actionButtons: IModalDialogButton[];
  options: Partial < IModalDialogOptions < ProductOperationModalData >> ;
  form: FormGroup;
  productOperation: ProductOperationRequest;
  operationType: ProductOperationType;
  leftover: ProductLeftoverResponse;
  operationEditModifier = 0;

  readonly MIN_PRODUCT_AMOUNT = 0.001;
  readonly DECIMAL_PLACES = 3;

  private btnClass = 'btn btn-outline-dark';
  submitPressed = false;

  constructor() {
    this.actionButtons = [{
        text: 'Отмена',
        buttonClass: this.btnClass,
        onAction: () => true
      },
      {
        text: 'Произвести операцию',
        buttonClass: this.btnClass,
        onAction: this.onSubmit.bind(this)
      }
    ];
  }

  ngOnInit() {

  }

  dialogInit(reference: ComponentRef < IModalDialog > , options: Partial < IModalDialogOptions < ProductOperationModalData >> ) {
    this.options = options;
    this.leftover = options.data.productLeftover;
    this.productOperation = options.data.productOperationRequest;
    this.operationType = ProductOperationType[this.productOperation.operationType];
    this.operationEditModifier = options.data.productOperationRequest.operationType == ProductOperationType.MANUFACTURED ?
      -options.data.productOperationRequest.amount | 0 : options.data.productOperationRequest.amount | 0;
    this.form = new FormGroup({
      operationType: new FormControl({
        value: this.operationType,
        disabled: true
      }),
      amount: new FormControl(this.exponent(this.productOperation.amount), [
        Validators.required,
        Validators.min(this.MIN_PRODUCT_AMOUNT),
        newDecimalPlacesValidator(this.DECIMAL_PLACES),
        this.validateLeftover.bind(this)
      ])
    });
  }

  onSubmit(): Promise < ProductOperationRequest > {
    if (this.form.invalid) {
      this.submitPressed = true;
      const reject = Promise.reject('invalid');
      this.options.data.func(reject);
      return reject;
    }

    const productOperation: ProductOperationRequest = {
      operationDate: this.productOperation.operationDate,
      productTypeId: this.productOperation.productTypeId,
      operationType: this.operationType,
      amount: new Decimal(this.form.value.amount).times(Math.pow(10, this.DECIMAL_PLACES)).toNumber()
    }
    const resolve = Promise.resolve(productOperation);
    this.options.data.func(resolve);
    return resolve;
  }

  isTouched(controlName: string) {
    return this.form.get(controlName).touched || this.submitPressed;
  }

  validateLeftover(control: FormControl) {
    if (control.value && this.isSoldOperation() && this.leftover.amount - this.convertValue(control.value) + this.operationEditModifier < 0) {
      return {
        'negativeLeftoverError': true
      };
    }
    return null;
  }

  isSoldOperation() {
    return this.operationType == ProductOperationType.SOLD;
  }

  convertValue(value: number): number {
    return new Decimal(value).times(Math.pow(10, this.DECIMAL_PLACES)).toNumber();
  }

  exponent(value: number): number {
    if (!value) {
      return undefined;
    }
    return new Decimal(value).dividedBy(Math.pow(10, this.DECIMAL_PLACES)).toNumber();
  }
}

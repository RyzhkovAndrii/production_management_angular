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
  integerValidator
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
    this.form = new FormGroup({
      operationType: new FormControl({
        value: this.operationType,
        disabled: true
      }),
      amount: new FormControl(undefined, [
        Validators.required,
        Validators.min(this.MIN_PRODUCT_AMOUNT),
        this.validateDecimalPlaces.bind(this),
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

  validateDecimalPlaces(control: FormControl) {
    if (control.value && !new Decimal(control.value).times(Math.pow(10, this.DECIMAL_PLACES)).isInteger()) {
      return {
        'decimalPlacesError': true
      };
    }
    return null;
  }

  validateLeftover(control: FormControl) {
    if (control.value && this.isSoldOperation() && this.leftover.amount - this.convertValue(control.value) < 0) {
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
}

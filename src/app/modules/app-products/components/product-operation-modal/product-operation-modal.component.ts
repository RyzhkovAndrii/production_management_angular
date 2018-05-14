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

  readonly MIN_PRODUCT_AMOUNT = 1;

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
    this.productOperation = options.data.productOperationRequest;
    this.operationType = ProductOperationType[this.productOperation.operationType];
    this.form = new FormGroup({
      operationType: new FormControl({
        value: this.operationType,
        disabled: true
      }),
      amount: new FormControl(undefined, [Validators.required, Validators.min(this.MIN_PRODUCT_AMOUNT), integerValidator])
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
      amount: this.form.value.amount
    }
    const resolve = Promise.resolve(productOperation);
    this.options.data.func(resolve);
    return resolve;
  }

  isTouched(controlName: string) {
    return this.form.get(controlName).touched || this.submitPressed;
  }
}

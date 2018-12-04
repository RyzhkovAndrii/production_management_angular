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
  RollOperationType
} from '../../enums/roll-operation-type.enum';
import {
  integerValidator
} from '../../../../app-utils/app-validators';
import {
  midnightDate,
  formatDate,
  formatDateServerToBrowser,
  formatDateBrowserToServer,
  isBeforeDate
} from '../../../../app-utils/app-date-utils';
import {
  ProductsService
} from '../../../app-products/services/products.service';

@Component({
  selector: 'app-roll-operation-modal',
  templateUrl: './roll-operation-modal.component.html',
  styleUrls: ['./roll-operation-modal.component.css']
})
export class RollOperationModalComponent implements OnInit, IModalDialog {

  actionButtons: IModalDialogButton[];
  options: Partial < IModalDialogOptions < RollOperationModalData >> ;
  batch: RollBatch;
  operation: RollOperationResponse;
  rollTypeId: number;
  manufacturedDate: Date;
  productsByRollInNorms: ProductTypeResponse[];

  form: FormGroup;
  operationType = RollOperationType.MANUFACTURE;

  readonly MIN_ROLL_AMOUNT = 1;

  private btnClass = 'btn btn-outline-dark';
  submitPressed = false;

  constructor(private productsService: ProductsService) {
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
    this.form = new FormGroup({
      operationType: new FormControl({
        value: this.operationType,
        disabled: !this.batch || this.batch.leftOverAmount <= 0
      }),
      operationDate: new FormControl(formatDateServerToBrowser(midnightDate()), [this.validateDateUseBeforeManufacture.bind(this), Validators.required]),
      rollAmount: new FormControl(this.operation ? this.operation.rollAmount : undefined, [Validators.required, Validators.min(this.MIN_ROLL_AMOUNT), this.validateAmount.bind(this), integerValidator, this.validateNegativeAmount.bind(this)]),
      productForUse: new FormControl({
          disabled: this.isProductSelectEnabled()
        },
        [
          this.validateRequiredProductUse.bind(this)
        ])
    });
  }

  dialogInit(reference: ComponentRef < IModalDialog > , options: Partial < IModalDialogOptions < RollOperationModalData >> ) {
    this.options = options;
    this.batch = options.data.batch;
    this.rollTypeId = options.data.rollTypeId;
    this.manufacturedDate = options.data.manufacturedDate;
    this.operation = options.data.operation;
    if (this.operation) {
      if (this.operation.productTypeIdForUseOperation) {
        this.productsService.getProductType(this.operation.productTypeIdForUseOperation)
          .subscribe(product => {
              this.form.get('productForUse').setValue(product)
            },
            error => options.data.openErrorModal(error));
      }
      switch (this.operation.operationType) {
        case RollOperationType.MANUFACTURE:
          this.batch.leftOverAmount -= this.operation.rollAmount;
          break;
        case RollOperationType.USE:
          this.batch.leftOverAmount += this.operation.rollAmount;
          break;
      }
      this.operationType = RollOperationType[this.operation.operationType];
    }
    this.productsByRollInNorms = options.data.productsByRollInNorms;
  }

  onSubmit(): Promise < RollOperationRequest > {
    if (this.form.invalid) {
      this.submitPressed = true;
      const reject = Promise.reject('invalid');
      this.options.data.func(reject);
      return reject;
    }

    const operationType = this.form.get('operationType').value;
    const rollOperation: RollOperationRequest = {
      operationDate: formatDateBrowserToServer(this.form.value.operationDate),
      operationType,
      manufacturedDate: formatDate(this.manufacturedDate),
      rollTypeId: this.rollTypeId,
      rollAmount: this.form.get('rollAmount').value,
      productTypeIdForUseOperation: operationType == RollOperationType.USE ? this.form.get('productForUse').value.id : undefined
    };
    const resolve = Promise.resolve(rollOperation);
    this.options.data.func(resolve);
    return resolve;
  }

  validateRequiredProductUse(control: FormControl) {
    if (this.form && (!control.value || !control.value.id) && this.form.get('operationType').value === RollOperationType.USE) {
      return {
        'requiredProductUse': true
      };
    }
    return null;
  }

  validateAmount(control: FormControl) {
    if (this.batch && control.value > this.batch.leftOverAmount) {
      if (this.form && this.form.value.operationType === RollOperationType.USE) {
        return {
          'greaterThanLeftError': true
        };
      }
    }
    return null;
  }

  validateNegativeAmount(control: FormControl) {
    if (this.batch && control.value + this.batch.leftOverAmount < 0) {
      return {
        'negativeLeftoverError': true
      };
    }
    return null;
  }

  validateDateUseBeforeManufacture(control: FormControl) {
    if (this.form && this.batch && this.form.value.operationType === RollOperationType.USE) {
      if (control && isBeforeDate(control.value, this.batch.dateManufactured)) {
        return {
          'beforeManufacturedError': true
        };
      }
    }
    return null;
  }

  revalidateForm() {
    this.revalidateOperationDate();
    this.form.get('rollAmount').updateValueAndValidity();
    this.form.get('productForUse').updateValueAndValidity();
  }

  revalidateOperationDate() {
    this.form.get('operationDate').updateValueAndValidity();
  }

  isTouched(controlName: string) {
    return this.form.get(controlName).touched || this.submitPressed;
  }

  compareProducts(a: ProductTypeResponse, b: ProductTypeResponse): boolean {
    return a.id == b.id;
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control.invalid && this.isTouched(controlName);
  }

  isProductSelectEnabled(): boolean {
    const control = this.form ? this.form.get('operationType') : undefined;
    return control ? control.value == RollOperationType.USE : false;
  }
}

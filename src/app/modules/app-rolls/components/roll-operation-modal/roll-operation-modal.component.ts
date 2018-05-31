import {
  Component,
  OnInit,
  ComponentRef
} from '@angular/core';
import {
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
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
  formatDate
} from '../../../../app-utils/app-date-utils';


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

  form: FormGroup;
  operationType = RollOperationType.MANUFACTURE;

  readonly MIN_ROLL_AMOUNT = 1;

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

  ngOnInit() {}

  dialogInit(reference: ComponentRef < IModalDialog > , options: Partial < IModalDialogOptions < RollOperationModalData >> ) {
    this.options = options;
    this.batch = options.data.batch;
    this.rollTypeId = options.data.rollTypeId;
    this.manufacturedDate = options.data.manufacturedDate;
    this.operation = options.data.operation;
    if (this.operation) {
      this.operationType = RollOperationType[this.operation.operationType];
    }
    this.form = new FormGroup({
      operationType: new FormControl({
        value: this.operationType,
        disabled: !this.batch || this.operation
      }),
      rollAmount: new FormControl(this.operation ? this.operation.rollAmount : undefined, [Validators.required, Validators.min(this.MIN_ROLL_AMOUNT), this.validateAmount.bind(this), integerValidator])
    });
  }

  onSubmit(): Promise < RollOperation > {
    if (this.form.invalid) {
      this.submitPressed = true;
      const reject = Promise.reject('invalid');
      this.options.data.func(reject);
      return reject;
    }

    const rollOperation: RollOperation = {
      operationDate: formatDate(midnightDate()),
      operationType: this.form.get('operationType').value,
      manufacturedDate: formatDate(this.manufacturedDate),
      rollTypeId: this.rollTypeId,
      rollAmount: this.form.get('rollAmount').value
    }
    const resolve = Promise.resolve(rollOperation);
    this.options.data.func(resolve);
    return resolve;
  }

  validateAmount(control: FormControl) {
    if (this.batch && control.value > this.batch.leftOverAmount) {
      if (this.form.value.operationType == RollOperationType.USE) {
        return {
          'greaterThanLeftError': true
        };
      }
    }
    return null;
  }

  revalidateAmount() {
    this.form.get('rollAmount').updateValueAndValidity();
  }

  isTouched(controlName: string) {
    return this.form.get(controlName).touched || this.submitPressed;
  }
}

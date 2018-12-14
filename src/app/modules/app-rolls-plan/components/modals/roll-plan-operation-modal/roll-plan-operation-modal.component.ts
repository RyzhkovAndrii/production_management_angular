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
  integerValidator
} from '../../../../../app-utils/app-validators';
import {
  midnightDate,
  formatDate,
} from '../../../../../app-utils/app-date-utils';

@Component({
  selector: 'app-plan-roll-operation-modal',
  templateUrl: './roll-plan-operation-modal.component.html',
  styleUrls: ['./roll-plan-operation-modal.component.css']
})
export class RollPlanOperationModalComponent implements OnInit, IModalDialog {

  actionButtons: IModalDialogButton[];
  options: Partial < IModalDialogOptions < RollPlanOperationModalData >> ;
  batch: RollPlanBatchResponse;
  operation: RollPlanOperationResponse;
  rollTypeId: number;
  manufacturedDate: Date;

  form: FormGroup;

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

  ngOnInit() {
    this.form = new FormGroup({
      rollAmount: new FormControl(this.operation ? this.operation.rollAmount : undefined, 
        [Validators.required, Validators.min(this.MIN_ROLL_AMOUNT), integerValidator])
    });
  }

  dialogInit(reference: ComponentRef < IModalDialog > , options: Partial < IModalDialogOptions < RollPlanOperationModalData >> ) {
    this.options = options;
    this.batch = options.data.batch;
    this.rollTypeId = this.batch.rollTypeId;
    this.manufacturedDate = midnightDate(options.data.batch.date);
    this.operation = options.data.operation;
  }

  onSubmit(): Promise < RollPlanOperationRequest > {
    if (this.form.invalid) {
      this.submitPressed = true;
      const reject = Promise.reject('invalid');
      this.options.data.func(reject);
      return reject;
    }

      const rollOperation: RollPlanOperationRequest = {
      date: formatDate(this.manufacturedDate),
      rollTypeId: this.rollTypeId,
      rollAmount: this.form.get('rollAmount').value
    };
    const resolve = Promise.resolve(rollOperation);
    this.options.data.func(resolve);
    return resolve;
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
}

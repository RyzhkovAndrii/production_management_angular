import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
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
} from '../../../app-utils/app-validators.module';
import { midnightDate, formatDate } from '../../../app-utils/app-date-utils.module';

@Component({
  selector: 'app-roll-operation-modal',
  templateUrl: './roll-operation-modal.component.html',
  styleUrls: ['./roll-operation-modal.component.css']
})
export class RollOperationModalComponent implements OnInit {

  @Input() batch: RollBatch;
  @Input() manufacturedDate: Date;
  @Input() rollTypeId;

  form: FormGroup;
  operationType = RollOperationType.MANUFACTURE;

  private readonly MIN_ROLL_AMOUNT = 1;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
    this.form = new FormGroup({
      operationType: new FormControl({
        value: this.operationType,
        disabled: !this.batch
      }),
      rollAmount: new FormControl(undefined, [Validators.required, Validators.min(this.MIN_ROLL_AMOUNT), this.validateAmount.bind(this), integerValidator])
    });
  }

  onSubmit() {
    let rollOperation: RollOperation = {
      operationDate: formatDate(midnightDate()),
      operationType: this.form.get('operationType').value,
      manufacturedDate: formatDate(this.manufacturedDate),
      rollTypeId: this.rollTypeId,
      rollAmount: this.form.get('rollAmount').value
    }
    this.activeModal.close(rollOperation);
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
}

import {
  Component,
  OnInit,
  ComponentRef
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import {
  IModalDialog,
  IModalDialogOptions,
  IModalDialogButton
} from 'ngx-modal-dialog';

@Component({
  selector: 'app-product-plan-operation-modal',
  templateUrl: './product-plan-operation-modal.component.html',
  styleUrls: ['./product-plan-operation-modal.component.css']
})
export class ProductPlanOperationModalComponent implements OnInit, IModalDialog {

  readonly MIN_AMOUNT = 0.001;

  actionButtons: IModalDialogButton[];
  data: ProductPlanOperationModalData;
  form: FormGroup;
  amountByStandard: number;
  recalculatedAmount: number = 0;

  private btnClass = 'btn btn-outline-dark';

  constructor() {
    this.actionButtons = [{
        text: 'Отмена',
        buttonClass: this.btnClass,
        onAction: () => true
      },
      {
        text: 'Сохранить',
        buttonClass: this.btnClass,
        onAction: this.onSubmit.bind(this)
      }
    ];
  }

  ngOnInit() {
    this.form = new FormGroup({
      desiredAmount: new FormControl(0, [Validators.required]),
      rollType: new FormControl(undefined, [Validators.required])
    })
  }

  dialogInit(reference: ComponentRef < IModalDialog > , options: Partial < IModalDialogOptions < ProductPlanOperationModalData >> ) {
    this.data = options.data;
    console.log(this.data);
  }

  onSubmit(): Promise < ProductPlanOperationRequest > {
    return null;
  }

  compareRolls(a: RollType, b: RollType): boolean {
    return a.id == b.id;
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    if (control == undefined) {
      return false;
    }
    return control.invalid && control.touched;
  }

  recalculateAmount(event: any) {
    console.log(event);
    const norm = this.data.standard.norm;
    const value: number = this.form.get('desiredAmount').value;
    const remaining = value % norm;
    if (remaining == 0) {
      this.recalculatedAmount = value;
    } else {
      this.recalculatedAmount = norm * (Math.ceil(value / norm));
    }
  }
}

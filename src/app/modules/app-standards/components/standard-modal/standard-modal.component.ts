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

@Component({
  selector: 'app-standard-modal',
  templateUrl: './standard-modal.component.html',
  styleUrls: ['./standard-modal.component.css']
})
export class StandardModalComponent implements OnInit, IModalDialog {

  actionButtons: IModalDialogButton[];
  private btnClass = 'btn btn-outline-dark';
  data: StandardModalData;
  form: FormGroup;

  readonly MIN_NORM = 1;

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

  dialogInit(reference: ComponentRef < IModalDialog > , options: Partial < IModalDialogOptions < any >> ) {
    this.data = options.data;
  };

  ngOnInit() {
    console.log(this.data.rollTypes);
    const rollTypes = this.data.standardInfo.rollTypes;
    this.form = new FormGroup({
      rollTypes: new FormControl(rollTypes.length > 0 && rollTypes[0].id ? rollTypes : [], [Validators.required]),
      standard: new FormControl(this.data.standardInfo.standardResponse.norm, [Validators.required, Validators.min(this.MIN_NORM)]),
      standardForDay: new FormControl(this.data.standardInfo.standardResponse.normForDay, [Validators.required, Validators.min(this.MIN_NORM)])
    });
  }

  removeItem(item: RollType) {
    const rolls = this.form.get('rollTypes');
    if (rolls.value.length == 1) {
      rolls.setValue([]);
    } else {
      rolls.setValue(this.form.get('rollTypes').value.filter(x => x.id != item.id));
    }
  }

  onSubmit(): Promise < Standard > {
    this.form.controls['rollTypes'].markAsTouched();
    this.form.controls['standard'].markAsTouched();
    this.form.controls['standardForDay'].markAsTouched();
    if (this.form.valid) {
      const standard: Standard = {
        productTypeId: this.data.standardInfo.productType.id,
        rollTypeIds: ( < RollType[] > this.form.value.rollTypes).map(x => x.id),
        norm: this.form.value.standard,
        normForDay: this.form.value.standardForDay
      }
      const resolve = Promise.resolve(standard);
      this.data.func(resolve);
      return resolve;
    } else {
      const reject = Promise.reject('invalid');
      this.data.func(reject);
      return reject;
    }
  }

  compareRolls(a: RollType, b: RollType): boolean {
    return a.id == b.id;
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control.invalid && control.touched;
  }
}

import {
  Component,
  OnInit,
  Input,
  ComponentRef,
  ViewChild
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
  IModalDialog,
  IModalDialogOptions,
  IModalDialogButton
} from 'ngx-modal-dialog';
import {
  from
} from 'rxjs/observable/from';
import appPresetColors from '../../../../app-utils/app-preset-colors';

@Component({
  selector: 'app-roll-type-modal',
  templateUrl: './roll-type-modal.component.html',
  styleUrls: ['./roll-type-modal.component.css']
})
export class RollTypeModalComponent implements OnInit, IModalDialog {

  actionButtons: IModalDialogButton[];
  options: Partial < IModalDialogOptions < RollTypeModalData >> ;

  form: FormGroup;
  presetColors = appPresetColors;

  readonly MIN_WEIGHT = 0.1;
  readonly MIN_THICKNESS = 0.1;
  rollType: RollType;
  colorCode;
  readonly MAX_NOTE_LENGTH = 20;

  submitPressed = false;

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
    this.colorCode = this.rollType ? this.rollType.colorCode : appPresetColors[0];

    this.form = new FormGroup({
      note: new FormControl(this.rollType ? this.rollType.note : '', Validators.maxLength(this.MAX_NOTE_LENGTH)),
      colorCode: new FormControl(this.colorCode),
      thickness: new FormControl(this.rollType ? this.rollType.thickness : undefined, [Validators.required, Validators.min(this.MIN_THICKNESS)]),
      minWeight: new FormControl(this.rollType ? this.rollType.minWeight : undefined, [Validators.required, Validators.min(this.MIN_WEIGHT), this.validateMinWeight.bind(this)]),
      maxWeight: new FormControl(this.rollType ? this.rollType.maxWeight : undefined, [Validators.required, Validators.min(this.MIN_WEIGHT), this.validateMaxWeight.bind(this)]),
      length: new FormControl(this.rollType ? this.rollType.length : undefined, [Validators.required])
    });
  }

  dialogInit(reference: ComponentRef < IModalDialog > , options: Partial < IModalDialogOptions < RollTypeModalData >> ) {
    this.options = options;
    this.rollType = options.data.rollType;
  };

  onSubmit(): Promise < RollType > {
    if (this.form.invalid) {
      this.submitPressed = true;
      const reject = Promise.reject('invalid');
      this.options.data.operation(reject);
      return reject;
    }

    const type: RollType = {
      id: undefined,
      note: this.form.value.note,
      colorCode: this.colorCode,
      thickness: this.form.value.thickness,
      minWeight: this.form.value.minWeight,
      maxWeight: this.form.value.maxWeight,
      length: this.form.value.length
    }
    const resolve = Promise.resolve(type);
    this.options.data.operation(resolve);
    return resolve;
  }

  validateMinWeight(control: FormControl) {
    if (control.value && this.form) {
      if (control.value > this.form.get('maxWeight').value) {
        return {
          'greaterThenMax': true
        };
      }
    }
    return null;
  }

  validateMaxWeight(control: FormControl) {
    if (control.value && this.form) {
      if (control.value < this.form.get('minWeight').value) {
        return {
          'smallerThenMin': true
        };
      }
    }
    return null;
  }

  revalidateMinWeight() {
    this.form.get('minWeight').updateValueAndValidity();
  }

  revalidateMaxWeight() {
    this.form.get('maxWeight').updateValueAndValidity();
  }

  isTouched(controlName: string) {
    return this.form.get(controlName).touched || this.submitPressed;
  }
}

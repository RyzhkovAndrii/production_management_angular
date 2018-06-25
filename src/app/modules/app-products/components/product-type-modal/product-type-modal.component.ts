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
import appPresetColors from '../../../../app-utils/app-preset-colors';
import {
  ProductsService
} from '../../services/products.service';

@Component({
  selector: 'app-product-type-modal',
  templateUrl: './product-type-modal.component.html',
  styleUrls: ['./product-type-modal.component.css']
})
export class ProductTypeModalComponent implements OnInit, IModalDialog {

  actionButtons: IModalDialogButton[];
  options: Partial < IModalDialogOptions < ProductTypeModalData >> ;

  form: FormGroup;
  submitPressed = false;
  presetColors = appPresetColors;
  productType: ProductTypeRequest;
  standard: Standard;
  colorCode: string;
  private btnClass = 'btn btn-outline-dark';

  readonly MIN_WEIGHT = 0.1;

  constructor(private productsService: ProductsService) {
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
    this.colorCode = this.productType ? this.productType.colorCode : appPresetColors[0];

    this.form = new FormGroup({
      name: new FormControl(this.productType ? this.productType.name : undefined, [Validators.required]),
      weight: new FormControl(this.productType ? this.productType.weight : undefined, [Validators.required, Validators.min(this.MIN_WEIGHT)]),
      colorCode: new FormControl({
        value: this.colorCode,
        disabled: this.standard
      })
    }, [], [this.validateUnique.bind(this)]);
  }

  dialogInit(reference: ComponentRef < IModalDialog > , options: Partial < IModalDialogOptions < ProductTypeModalData >> ) {
    this.options = options;
    this.productType = options.data.productType;
    this.standard = options.data.standard;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.submitPressed = true;
      const reject = Promise.reject('invalid');
      this.options.data.operation(reject);
      return reject;
    }

    const type: ProductTypeRequest = {
      name: this.form.value.name,
      weight: this.form.value.weight,
      colorCode: this.colorCode
    };
    const resolve = Promise.resolve(type);
    this.options.data.operation(resolve);
    return resolve;
  }

  isTouched(controlName: string) {
    return this.form.get(controlName).touched || this.submitPressed;
  }

  validateUnique(form: FormGroup) {
    return this.productsService.getProductTypesByName(form.value.name).map(data => {
      if (data.findIndex((value, index, array) => {
          return value.name === form.value.name &&
            value.weight === form.value.weight &&
            value.colorCode.toLowerCase() === (form.value.colorCode || this.colorCode).toLowerCase();
        }) >= 0) {
        return {
          'notUnique': true
        }
      }
      return null;
    });
  }
}

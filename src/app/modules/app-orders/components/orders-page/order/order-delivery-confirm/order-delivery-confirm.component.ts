import { Component, OnInit, EventEmitter, Output, ComponentRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { getDate } from '../../../../../../app-utils/app-date-utils';
import { IModalDialog, IModalDialogOptions, IModalDialogButton } from '../../../../../../../../node_modules/ngx-modal-dialog';

@Component({
  selector: 'app-order-delivery-confirm',
  templateUrl: './order-delivery-confirm.component.html',
  styleUrls: ['./order-delivery-confirm.component.css']
})
export class OrderDeliveryConfirmComponent implements IModalDialog {

  readonly now: string = moment(new Date()).format('YYYY-MM-DD');

  actionButtons: IModalDialogButton[] = [];
  
  form: FormGroup = new FormGroup({
    'actualDeliveryDate': new FormControl(this.now, [Validators.required])
  });

  constructor() { }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.actionButtons.push({
      text: 'Отменить',
      buttonClass: 'btn btn-outline-dark',
      onAction: () => true
    })
    this.actionButtons.push({
      text: 'Сохранить',
      buttonClass: 'btn btn-outline-dark',
      onAction: () => {
        const { actualDeliveryDate } = this.form.value;
        const date = getDate(actualDeliveryDate, 'YYYY-MM-DD');
        console.log(options.data.func);
        options.data.func(date);
        return true;
      }
    })
  }

}

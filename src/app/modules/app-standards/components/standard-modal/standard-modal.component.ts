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
  FormControl
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
    this.form = new FormGroup({
      rollTypes: new FormControl(this.data.standardInfo.rollTypes),
      standard: new FormControl(this.data.standardInfo.standardResponse.norm)
    });
  }

  removeItem(item: RollType) {
    const rolls = this.form.get('rollTypes');
    if (rolls.value.length == 1) {
      rolls.setValue([]);
    } else {
      rolls.setValue(this.form.get('rollTypes').value.filter(x => x.id == item.id));
    }
  }

  onSubmit(): Promise < Standard > {
    return null;
  }

}

import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {
  CheckStatus
} from '../../enums/check-status.enum';

@Component({
  selector: 'check-select',
  templateUrl: './check-select.component.html',
  styleUrls: ['./check-select.component.css']
})
export class CheckSelectComponent implements OnInit {

  @Input() checkStatus: CheckStatus;
  @Input() disabled = false;
  @Output() changeCheckStatus = new EventEmitter < CheckStatus > ();
  selectedModel: AppSelect;
  items: AppSelect[] = [{
      label: 'check_box_outline_blank',
      value: 'NOT_CHECKED',
      clazz: 'text-secondary'
    },
    {
      label: 'check_box',
      value: 'CONFIRMED',
      clazz: 'text-success'
    },
    {
      label: 'indeterminate_check_box',
      value: 'NOT_CONFIRMED',
      clazz: 'text-danger'
    }
  ]

  constructor() {}

  ngOnInit() {
    this.selectedModel = this.items
      .find((value, index, array) => value.value === this.checkStatus);
  }

  changeRollCheck(model: AppSelect) {
    this.checkStatus = CheckStatus[model.value];
    this.changeCheckStatus.emit(this.checkStatus);
  }
}

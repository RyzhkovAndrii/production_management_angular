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
  selector: 'app-roll-check',
  templateUrl: './roll-check.component.html',
  styleUrls: ['./roll-check.component.css']
})
export class RollCheckComponent implements OnInit {

  @Input() rollCheck: RollCheck;
  @Output() changeCheckStatus = new EventEmitter < RollCheck > ();
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
      .find((value, index, array) => value.value === this.rollCheck.rollLeftOverCheckStatus);
  }

  changeRollCheck(model: AppSelect) {
    let result = < RollCheck > {};
    Object.assign(result, this.rollCheck);
    result.rollLeftOverCheckStatus = CheckStatus[model.value];
    this.changeCheckStatus.emit(result);
  }
}

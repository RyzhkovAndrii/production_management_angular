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

@Component({
  selector: 'app-roll-type-modal',
  templateUrl: './roll-type-modal.component.html',
  styleUrls: ['./roll-type-modal.component.css']
})
export class RollTypeModalComponent implements OnInit {

  form: FormGroup;
  presetColors = ['#ffffff', '#2f2f2f', '#ff9d14', '#008a17', '#f1e972', '#edf100'];

  readonly MIN_WEIGHT = 0.1;
  readonly MIN_THICKNESS = 0.1;
  @Input() rollType: RollType;
  @Input() title: string;
  colorCode;
  readonly MAX_NOTE_LENGTH = 20;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
    this.colorCode = this.rollType ? this.rollType.colorCode : '#ffffff';

    this.form = new FormGroup({
      note: new FormControl(this.rollType ? this.rollType.note : '', Validators.maxLength(this.MAX_NOTE_LENGTH)),
      colorCode: new FormControl(this.colorCode),
      thickness: new FormControl(this.rollType ? this.rollType.thickness : undefined, 
        [Validators.required, Validators.min(this.MIN_THICKNESS)]),
      weight: new FormControl(this.rollType ? this.rollType.weight : undefined, 
        [Validators.required, Validators.min(this.MIN_WEIGHT)])
    });
  }

  onSubmit() {
    const type: RollType = {
      id: undefined,
      note: this.form.value.note,
      colorCode: this.colorCode,
      thickness: this.form.value.thickness,
      weight: this.form.value.weight
    }    
    this.activeModal.close(type);
  }
}

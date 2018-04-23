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
  presetColors = ['#ffffff', '#000000', '#ff9d14', '#008a17', '#f1e972', '#edf100'];

  private readonly MIN_WEIGHT = 0.1;
  private readonly MIN_THICKNESS = 0.1;
  @Input() rollType: RollType;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {

    this.form = new FormGroup({
      name: new FormControl(this.rollType ? this.rollType.name : '', Validators.required),
      colorCode: new FormControl(this.rollType ? this.rollType.colorCode : '#ffffff'),
      thickness: new FormControl(this.rollType ? this.rollType.thickness : undefined, 
        [Validators.required, Validators.min(this.MIN_THICKNESS)]),
      weight: new FormControl(this.rollType ? this.rollType.weight : undefined, 
        [Validators.required, Validators.min(this.MIN_WEIGHT)])
    });
  }

  onSubmit() {
    const type: RollType = {
      id: undefined,
      name: this.form.value.name,
      colorCode: this.form.get('colorCode').value,
      thickness: this.form.value.thickness,
      weight: this.form.value.weight
    }    
    this.activeModal.close(type);
  }
}

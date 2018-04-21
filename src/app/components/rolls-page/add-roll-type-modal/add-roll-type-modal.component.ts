import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-roll-type-modal',
  templateUrl: './add-roll-type-modal.component.html',
  styleUrls: ['./add-roll-type-modal.component.css']
})
export class AddRollTypeModalComponent implements OnInit {

  form: FormGroup;

  private readonly MIN_WEIGHT = 0.1;
  private readonly MIN_THICKNESS = 0.1;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      colorCode: new FormControl('#ffffff'),
      thickness: new FormControl(undefined,[Validators.required, Validators.min(this.MIN_THICKNESS)]),
      weight: new FormControl(undefined, [Validators.required, Validators.min(this.MIN_WEIGHT)])
    });
  }

  createRollType() {
    this.activeModal.close(this.form.value);
  }
}

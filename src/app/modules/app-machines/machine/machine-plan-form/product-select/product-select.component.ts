import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-product-select',
  templateUrl: './product-select.component.html',
  styleUrls: ['./product-select.component.css']
})
export class ProductSelectComponent implements OnInit {

  @Input() items;
  @Input() formGroup;
  @Input() formControlName;

  @Output() change = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onChange() {
    this.change.emit();
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

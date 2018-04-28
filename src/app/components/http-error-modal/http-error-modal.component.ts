import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-http-error-modal',
  templateUrl: './http-error-modal.component.html',
  styleUrls: ['./http-error-modal.component.css']
})
export class HttpErrorModalComponent implements OnInit {

  @Input() messages: string[];

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {

  @Input() user: User;
  @Output() cardClick = new EventEmitter<User>();

  constructor() { }

  ngOnInit() {
  }

  onClick() {
    this.cardClick.emit(this.user);
  }

}

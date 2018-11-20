import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {

  constructor(
    private title: Title
  ) {
    this.title.setTitle('Доступ запрещен');
  }

  ngOnInit() {
  }

}

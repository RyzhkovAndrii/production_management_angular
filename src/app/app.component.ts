import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(
    public viewContainerRef: ViewContainerRef // Need to get root view container.
  ) { }

  ngOnInit() {
  }

}

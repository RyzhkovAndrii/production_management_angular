import {
  Component,
  OnInit,
  Input
} from '@angular/core';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.css']
})
export class CircleComponent implements OnInit {
  @Input() color: string;

  constructor() {}

  ngOnInit() {}

}

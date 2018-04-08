import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-rolls-page',
  templateUrl: './rolls-page.component.html',
  styleUrls: ['./rolls-page.component.css']
})
export class RollsPageComponent implements OnInit {
  dateHeader: number[] = [];

  constructor() {}

  ngOnInit() {
    const daysInTable = 30;
    const date = this.substructDays(new Date(), daysInTable);
    for (let i = daysInTable; i > 0; i--) {
      this.dateHeader.push(this.addDays(date, 1).getDate());
    }
  }

  private substructDays(date: Date, days: number): Date {
    date.setDate(date.getDate() - days);
    return date;
  }

  private addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }
}

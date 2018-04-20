import {
  Component,
  OnInit
} from '@angular/core';
import {
  substructDays,
  midnightDate,
  addDays,
  formatDate,
  getIndex
} from '../../app-utils/app-date-utils.module';
import {
  RollsService
} from '../../services/rolls.service';
import { compareColors } from '../../app-utils/app-comparators.module';

@Component({
  selector: 'app-rolls-page',
  templateUrl: './rolls-page.component.html',
  styleUrls: ['./rolls-page.component.css']
})
export class RollsPageComponent implements OnInit {
  dateHeader: Date[] = [];
  rollsInfo: RollInfo[] = [];
  daysInTable = 30;
  restDate = substructDays(midnightDate(), this.daysInTable + 1);
  toDate = midnightDate();
  
  constructor(private rollsService: RollsService) {}

  ngOnInit() {
    const date = substructDays(midnightDate(), this.daysInTable);
    for (let i = 1; i <= this.daysInTable; i++) {
      const substructedDate = addDays(date, i);
      this.dateHeader.push(substructedDate);
    }
    this.rollsService.getRollsInfo(this.restDate, this.toDate)
      .subscribe(data => {
        this.rollsInfo = data;
      });
  }

  getBatch(rollBatch: RollBatch): number | string {
     if (rollBatch) return rollBatch.leftAmount;
     else return '';
  }

  getBatches(rollBatches: RollBatch[]) {
    const result = new Array(this.daysInTable);
    rollBatches.forEach(item => result[getIndex(midnightDate(item.dateManufactured), result.length, (24*60*60*1000), this.toDate)] = item);
    return result;
  }

  sortByColor(rollsInfo: RollInfo[]): RollInfo[] {
    return rollsInfo.sort((a, b) => compareColors(a.rollType.colorCode, b.rollType.colorCode));
  }
}

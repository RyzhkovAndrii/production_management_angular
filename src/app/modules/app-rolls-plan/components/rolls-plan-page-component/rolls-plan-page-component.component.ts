import {
  Component,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import {
  ModalDialogService
} from 'ngx-modal-dialog';
import {
  RollsPlanService
} from '../../services/rolls-plan.service';
import {
  AppModalService
} from '../../../app-shared/services/app-modal.service';
import {
  midnightDate,
  addDays,
  isSameDate,
  getDate
} from '../../../../app-utils/app-date-utils';

@Component({
  selector: 'app-rolls-plan-page-component',
  templateUrl: './rolls-plan-page-component.component.html',
  styleUrls: ['./rolls-plan-page-component.component.css']
})
export class RollsPlanPageComponentComponent implements OnInit {

  currentDate: Date;
  fromDate: Date;
  toDate: Date;
  rollssPlanInfo: RollPlanInfo[] = [];

  firstWeekHeaderDates: Date[] = [];
  secondWeekHeaderDates: Date[] = [];
  secondMonthIndex: number = -1;
  readonly DATE_HEADER_SIZE: number = 7;

  constructor(
    private rollsPlanService: RollsPlanService,
    private ngxModalService: ModalDialogService,
    private viewRef: ViewContainerRef,
    private appModalService: AppModalService) {}

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.initDateHeaders();
    this.rollsPlanService.getRollPlansInfo(this.currentDate, this.toDate)
      .subscribe(
        data => {
          console.log(data);
          this.rollssPlanInfo = data
        },
        error => this.appModalService.openHttpErrorModal(this.ngxModalService, this.viewRef, error)
      );
  }

  private initDateHeaders() {
    this.currentDate = midnightDate();
    this.fromDate = addDays(this.currentDate, 1);
    this.toDate = addDays(this.currentDate, 14);
    for (let i = 0; i < this.DATE_HEADER_SIZE; i++) {
      this.firstWeekHeaderDates.push(addDays(this.currentDate, i + 1));
      if (this.secondMonthIndex == -1 && this.fromDate.getMonth() < this.firstWeekHeaderDates[i].getMonth()) {
        this.secondMonthIndex = i;
      }
    }
    for (let i = this.DATE_HEADER_SIZE; i < this.DATE_HEADER_SIZE * 2; i++) {
      this.secondWeekHeaderDates.push(addDays(this.currentDate, i + 1));
      if (this.secondMonthIndex == -1 && this.firstWeekHeaderDates[this.firstWeekHeaderDates.length - 1].getMonth() < this.secondWeekHeaderDates[i - this.DATE_HEADER_SIZE].getMonth()) {
        this.secondMonthIndex = i;
      }
    }
  }

  isFirstInOneMoth() {
    return this.secondMonthIndex > 6 || this.secondMonthIndex < 0;
  }

  isSecondInOneMoth() {
    return this.secondMonthIndex < this.firstWeekHeaderDates.length;
  }

  findBatch(batches: RollPlanBatchResponse[], colDate: Date): RollPlanBatchResponse {
    return batches.find(x => isSameDate(colDate, getDate(x.date)));
  }

  getWeight(rollType: RollType): string | number {
    return rollType.minWeight === rollType.maxWeight ? rollType.minWeight : `${rollType.minWeight}–${rollType.maxWeight}`;
  }
}

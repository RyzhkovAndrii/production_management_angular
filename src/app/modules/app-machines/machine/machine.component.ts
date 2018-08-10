import { Component, Input, ViewContainerRef } from '@angular/core';
import { Observable, Subject } from '../../../../../node_modules/rxjs';
import * as moment from 'moment';

import { MachinePlanService } from '../services/machine-plan.service';
import { MachinePlan } from '../models/machine-plan.model'
import { compareDateTimes } from '../../../app-utils/app-comparators';
import { MachinePlanItemService } from '../services/machine-plan-item.service';
import { ModalDialogService } from '../../../../../node_modules/ngx-modal-dialog';
import { AppModalService } from '../../app-shared/services/app-modal.service';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.css'],
})
export class MachineComponent {

  readonly dateTimeFormat = 'DD-MM-YYYY HH:mm:ss'

  @Input() machineNumber: number;
  @Input() standards: Standard[];

  @Input()
  set date(date: Date) {
    this._date = date;
    this.fetchPlanData();
  }

  get date() {
    return this._date;
  }

  private _date: Date;

  filledDailyMachinePlan: MachinePlan[] = [];
  dailyMachinePlan: MachinePlan[];

  isMachinePlanFormVisible = false;
  currentMachinePlan: number;

  isTableVisible = false;
  isFetched = false;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private machinePlanService: MachinePlanService,
    private machinePlanItemService: MachinePlanItemService,
    private viewRef: ViewContainerRef,
    private ngxModalDialogService: ModalDialogService,
    private appModalService: AppModalService
  ) { }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  openMachinePlanForm(index: number) {
    this.currentMachinePlan = index;
    this.isMachinePlanFormVisible = true;
  }

  submitMachinePlanForm(plan: MachinePlan) {
    this.dailyMachinePlan.push(plan);
    this.dailyMachinePlan.sort((a, b) => compareDateTimes(a.timeStart, b.timeStart));
    this.fillDailyPlan();
    this.isMachinePlanFormVisible = false;
  }

  cancelMachinePlanForm() {
    this.isMachinePlanFormVisible = false;
  }

  toggleTableVisible() {
    this.isTableVisible = !this.isTableVisible;
  }

  private fetchPlanData() {
    this.isFetched = false;
    const obsBatch: Observable<any>[] = [];
    this.machinePlanService
      .getAll(this.date, this.machineNumber)
      .subscribe(response => {
        this.dailyMachinePlan = response;
        this.dailyMachinePlan.forEach(plan => obsBatch.push(this.machinePlanItemService.getAll(plan.id)));
        if (obsBatch.length === 0) {
          this.isFetched = true;
        } else {
          Observable
            .forkJoin(obsBatch)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
              response => {
                response.forEach((planItems, i) => this.dailyMachinePlan[i].planItems = planItems);
                this.isFetched = true;
              },
              error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
            );
        }
        this.fillDailyPlan();
      })
  }

  fillDailyPlan() {
    this.filledDailyMachinePlan = [];
    var diff;
    var nextStart;
    const todayStart = moment(this.date).startOf('days').add(8, 'hours');
    const todayEnd = moment(this.date).endOf('days').add(8, 'hours');
    const firstPlanTime = this.dailyMachinePlan.length === 0
      ? todayEnd
      : moment(this.getDateTimeStart(this.dailyMachinePlan[0]));
    const firstStart = moment(firstPlanTime);
    diff = this.getDiffInHours(todayStart, firstStart);
    if (diff > 0) {
      const empty = this.getEmptyPlan(diff);
      this.filledDailyMachinePlan.push(empty);
    }
    for (var i = 0; i < this.dailyMachinePlan.length; i++) {
      this.filledDailyMachinePlan.push(this.dailyMachinePlan[i]);
      const currentEnd = moment(this.getDateTimeFinish(this.dailyMachinePlan[i]));
      if (i === this.dailyMachinePlan.length - 1) {
        nextStart = todayEnd;
      } else {
        nextStart = moment(this.getDateTimeStart(this.dailyMachinePlan[i + 1]));
      }
      diff = this.getDiffInHours(currentEnd, nextStart);
      if (diff > 0) {
        const empty = this.getEmptyPlan(diff);
        this.filledDailyMachinePlan.push(empty);
      }
    }
  }

  private getEmptyPlan(duration: number) {
    let empty = new MachinePlan();
    empty.duration = duration;
    return empty;
  }

  private getDateTimeStart(plan: MachinePlan): Date {
    return moment(plan.timeStart, this.dateTimeFormat).toDate();
  }

  private getDateTimeFinish(plan: MachinePlan): Date {
    const dateTimeStart = this.getDateTimeStart(plan);
    return moment(dateTimeStart).add(plan.duration, 'hour').toDate();
  }

  private getDiffInHours(before, after): number {
    return moment.duration(after.diff(before)).asHours();
  }

}

import { Component, Input } from '@angular/core';
import * as moment from 'moment';

import { MachineService } from '../services/machine.service';
import { MachinePlan } from '../models/machine-plan.model'
import { compareDateTimes } from '../../../app-utils/app-comparators';

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

  public filledDailyMachinePlan: MachinePlan[] = [];
  public dailyMachinePlan: MachinePlan[];

  public isMachinePlanFormVisible = false;
  public currentMachinePlan: number;

  public isTableVisible = false;

  constructor(
    private machineService: MachineService
  ) { }

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
    this.machineService
      .getAll(this.date, this.machineNumber)
      .subscribe(response => {
        this.dailyMachinePlan = response;
        this.fillDailyPlan();
      });
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

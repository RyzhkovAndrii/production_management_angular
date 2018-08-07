import { Component, Input } from '@angular/core';
import * as moment from 'moment';

import { MachineService } from '../services/machine.service';
import { MachinePlanItem } from '../models/machine-plan-item.model';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.css'],
})
export class MachineComponent {

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

  public filledMachinePlan: MachinePlanItem[] = [];
  public machinePlan: MachinePlanItem[];

  public isMachinePlanFormVisible = false;
  public currentPlanItem: number;

  public isTableVisible = false;

  constructor(
    private machineService: MachineService
  ) { }

  openPlanItemForm(index: number) {
    this.currentPlanItem = index;
    this.isMachinePlanFormVisible = true;
  }

  cancelPlanItemForm() {
    this.isMachinePlanFormVisible = false;
  }

  toggleTableVisible() {
    this.isTableVisible = !this.isTableVisible;
  }

  private fetchPlanData() {
    this.machineService
      .getAll(this.date, this.machineNumber)
      .subscribe(response => {
        this.machinePlan = response;
        this.fillPlan();
      });
  }

  fillPlan() {
    this.filledMachinePlan = [];
    var diff;
    var nextStart;
    const firstPlanTime = this.machinePlan.length === 0
      ? moment(this.date).endOf('day')  // todo create date
      : moment(this.getDateTimeStart(this.machinePlan[0]));
    const firstStart = moment(firstPlanTime);
    const todayMidnight = moment(firstPlanTime).startOf('day');
    const tomorrowMidnight = moment(firstPlanTime).endOf('day');
    diff = this.getDiffInHours(todayMidnight, firstStart);
    if (diff > 0) {
      const empty = this.getEmptyPlan(diff);
      this.filledMachinePlan.push(empty);
    }
    for (var i = 0; i < this.machinePlan.length; i++) {
      this.filledMachinePlan.push(this.machinePlan[i]);
      const currentEnd = moment(this.getDateTimeFinish(this.machinePlan[i]));
      if (i === this.machinePlan.length - 1) {
        nextStart = tomorrowMidnight;
      } else {
        nextStart = moment(this.getDateTimeStart(this.machinePlan[i + 1]));
      }
      diff = this.getDiffInHours(currentEnd, nextStart);
      if (diff > 0) {
        const empty = this.getEmptyPlan(diff);
        this.filledMachinePlan.push(empty);
      }
    }
  }

  private getEmptyPlan(duration: number) {
    let empty = new MachinePlanItem();
    empty.duration = duration;
    return empty;
  }

  private getDateTimeStart(planItem: MachinePlanItem): Date {
    const format = 'DD-MM-YYYY HH:mm:SS';
    return moment(planItem.timeStart, format).toDate();
  }

  private getDateTimeFinish(planItem: MachinePlanItem): Date {
    const dateTimeStart = this.getDateTimeStart(planItem);
    return moment(dateTimeStart).add(planItem.duration, 'hour').toDate();
  }

  private getDiffInHours(before, after): number {
    return moment.duration(after.diff(before)).asHours();;
  }

}

import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

import { MachineService } from '../services/machine.service';
import { MachinePlanItem } from '../models/machine-plan-item.model';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.css']
})
export class MachineComponent implements OnInit {

  @Input() public machineNumber: number;

  public filledMachinePlan: MachinePlanItem[] = [];
  public machinePlan: MachinePlanItem[];

  constructor(
    private machineService: MachineService
  ) { }

  ngOnInit() {
    this.fetchPlanData();
  }

  private fetchPlanData() {
    this.machineService
      .getAll(this.machineNumber)
      .subscribe(response => {
        this.machinePlan = response;
        this.fillPlan();
      });
  }

  private fillPlan() {
    var diff;
    var nextStart;
    const firstPlanTime = this.getDateTimeStart(this.machinePlan[0]);
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
    const format = 'DD-MM-YYYY HH:mm';
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

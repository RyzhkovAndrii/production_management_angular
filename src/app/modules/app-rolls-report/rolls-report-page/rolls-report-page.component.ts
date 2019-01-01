import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RollsService } from '../../app-rolls/services/rolls.service';
import { RollsReportService } from '../services/rolls-report.service';
import { RollReport } from '../models/roll-report.model';
import { compareRollTypes } from '../../../app-utils/app-comparators';

interface RollReportTableRow {
  roll: RollType;
  report: RollReport;
}

@Component({
  selector: 'app-rolls-report-page',
  templateUrl: './rolls-report-page.component.html',
  styleUrls: ['./rolls-report-page.component.css']
})
export class RollsReportPageComponent implements OnInit {

  reportsTable: RollReportTableRow[] = [];

  from: Date;
  to: Date;

  constructor(
    private rollService: RollsService,
    private rollsReportService: RollsReportService
  ) { }

  ngOnInit() {
    // this.from = new Date(new Date().setMonth(new Date().getMonth() - 1));
    this.from = new Date('2018-01-01');
    this.to = new Date();
    this.loadData(this.from, this.to);
  }

  private loadData(from: Date, to: Date) {
    this.rollsReportService
      .getAll(from, to)
      .subscribe(reports => {
        Observable.forkJoin(reports.map(report => this.rollService.getRollType(report.rollTypeId)))
          .subscribe(rolls => {
            this.reportsTable = rolls
              .sort((r1, r2) => compareRollTypes(r1, r2))
              .map(roll => {
                return {
                  roll: roll,
                  report: reports.find(report => report.rollTypeId === roll.id)
                };
              });
          });
      });
  }

  getWeight(rollType: RollType): string | number {
    return rollType.minWeight === rollType.maxWeight ? rollType.minWeight : `${rollType.minWeight}–${rollType.maxWeight}`;
  }

  getDeviation(report: RollReport) {
    return report.actualAmount - report.planAmount;
  }

  getDeviationInPercent(report: RollReport) {
    return Math.abs(this.getDeviation(report) / report.planAmount * 100).toFixed(1);
  }

}

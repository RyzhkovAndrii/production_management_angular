import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import moment = require('moment');
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { ProductsService } from '../../app-products/services/products.service';
import { StandardsReportService } from '../services/standards-report.service';
import { formatDateServerToBrowser } from '../../../app-utils/app-date-utils';
import { StandardReport } from '../models/standard-report.model';
import { compareProductTypes } from '../../../app-utils/app-comparators';
import { Observable } from 'rxjs/Observable';
import { RollsService } from '../../app-rolls/services/rolls.service';

interface StandardReportTableRow {
  product: ProductTypeResponse;
  report: StandardReport;
}

@Component({
  selector: 'app-standards-report-page',
  templateUrl: './standards-report-page.component.html',
  styleUrls: ['./standards-report-page.component.css']
})
export class StandardsReportPageComponent implements OnInit {

  reportsTable: StandardReportTableRow[];
  totalReport: StandardReport;
  totalDefect: string;
  totalDefectPercent: number;
  rollTypes: RollType[];

  readonly now: string = moment(new Date()).format('YYYY-MM-DD');
  from: Date;
  to: Date;
  dateForm: FormGroup;

  dateRangeError = false;

  @ViewChild('table') table: ElementRef;
  hideFixedHeader = true;
  readonly fixedHeaderTopPosition = 40;
  fixedHeaderLeftPosition: number;

  constructor(
    private productService: ProductsService,
    private rollService: RollsService,
    private standardsReportService: StandardsReportService,
    private title: Title
  ) {
    this.title.setTitle('Отчет по нормативам');
  }

  ngOnInit() {
    this.from = new Date(new Date().setDate(1));
    this.to = new Date();
    this.dateForm = new FormGroup({
      'fromDate': new FormControl(formatDateServerToBrowser(this.from), [Validators.required]),
      'toDate': new FormControl(formatDateServerToBrowser(this.to), [Validators.required])
    });
    this.loadData(this.from, this.to);
  }

  private loadData(from: Date, to: Date): any {
    this.standardsReportService
      .getAll(from, to)
      .subscribe(reports => {
        this.computeTotal(reports);
        Observable.forkJoin(reports.map(report => this.productService.getProductType(report.productTypeId)))
          .subscribe(products => {
            const filledReportTable = products
              .sort((p1, p2) => compareProductTypes(p1, p2))
              .map(product => {
                return {
                  product: product,
                  report: reports.find(rep => rep.productTypeId === product.id)
                };
              });
            this.rollService.getRollTypes()
              .subscribe(types => {
                this.rollTypes = types;
                this.reportsTable = filledReportTable;
                this.getTotalDefect();
              });
          });
      });
  }

  private computeTotal(reports: StandardReport[]) {
    this.totalReport = new StandardReport();
    this.totalDefectPercent = 0;
    this.totalReport.rolls = [];
    this.totalReport.rolls.push({ rollTypeId: -1, amount: 0 });
    this.totalReport.productActualAmount = 0;
    this.totalReport.productPlanAmount = 0;
    reports.forEach(report => {
      const rollsAmount = report.rolls.length ? report.rolls.map(roll => roll.amount).reduce((a, b) => a + b) : 0;
      this.totalReport.rolls[0].amount += rollsAmount;
      this.totalReport.productActualAmount += report.productActualAmount;
      this.totalReport.productPlanAmount += report.productPlanAmount === null ? 0 : report.productPlanAmount;
    });
  }

  changeDate() {
    const { fromDate, toDate } = this.dateForm.value;
    if (new Date(fromDate) > new Date(toDate)) {
      this.dateRangeError = true;
      return;
    }
    this.dateRangeError = false;
    this.from = new Date(fromDate);
    this.to = new Date(toDate);
    this.loadData(this.from, this.to);
  }

  getRollType(typeId: number) {
    return this.rollTypes.find(type => type.id === typeId);
  }

  getRollType$(typeId: number): Observable<RollType> {
    return this.rollService.getRollType(typeId);
  }

  getDeviation(report: StandardReport) {
    return report.productActualAmount - report.productPlanAmount;
  }

  getDeviationInPercent(report: StandardReport) {
    return Math.abs(this.getDeviation(report) / report.productPlanAmount * 100).toFixed(1);
  }

  private calcDefectPercent(row: StandardReportTableRow) {
    const rollsWeight = row.report.rolls
      .map(roll => {
        const rollType = this.rollTypes.find(type => type.id === roll.rollTypeId);
        return roll.amount * (rollType.maxWeight + rollType.minWeight) / 2;
      })
      .reduce((a, b) => (a + b));
    const productWeight = row.product.weight * row.report.productActualAmount;
    return ((rollsWeight - productWeight / 1000) / rollsWeight * 100);
  }

  getDefectPercent(row: StandardReportTableRow) {
    return this.calcDefectPercent(row).toFixed(1);
  }

  private getTotalDefect() {
    const defectCount = this.reportsTable.filter(row => (row.report.productPlanAmount !== null && row.report.productPlanAmount)).length;
    if (!defectCount) {
      this.totalDefect = null;
    } else {
      const summDefect = this.reportsTable
        .filter(row => (row.report.productPlanAmount !== null && row.report.productPlanAmount))
        .map(row => this.calcDefectPercent(row))
        .reduce((a, b) => a + b);
      this.totalDefect = (summDefect / defectCount).toFixed(1);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.toggleFixedHeader();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.toggleFixedHeader();
  }

  private toggleFixedHeader() {
    const tableOffset = this.table.nativeElement.getBoundingClientRect().top;
    console.log(tableOffset);
    this.hideFixedHeader = (tableOffset > this.fixedHeaderTopPosition);
    this.fixedHeaderLeftPosition = this.table.nativeElement.getBoundingClientRect().left;
  }

}

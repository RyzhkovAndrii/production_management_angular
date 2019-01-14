import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ProductsReportService } from '../services/products-report.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

import { ProductsService } from '../../app-products/services/products.service';
import { ProductReport } from '../models/product-report.model';
import { formatDateServerToBrowser } from '../../../app-utils/app-date-utils';
import { compareProductTypes } from '../../../app-utils/app-comparators';

interface ProductReportTableRow {
  product: ProductTypeResponse;
  report: ProductReport;
}

@Component({
  selector: 'app-products-report-page',
  templateUrl: './products-report-page.component.html',
  styleUrls: ['./products-report-page.component.css']
})
export class ProductsReportPageComponent implements OnInit {

  reportsTable: ProductReportTableRow[] = [];
  totalReport: ProductReport = new ProductReport();

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
    private productsReportService: ProductsReportService,
    private title: Title
  ) {
    this.title.setTitle('Отчет по продукции');
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

  private loadData(from: Date, to: Date) {
    this.reportsTable = [];
    this.productsReportService
      .getAll(from, to)
      .subscribe(reports => {
        this.computeTotal(reports);
        Observable.forkJoin(reports.map(report => this.productService.getProductType(report.productTypeId)))
          .subscribe(products => {
            this.reportsTable = products
              .sort((p1, p2) => compareProductTypes(p1, p2))
              .map(product => {
                return {
                  product: product,
                  report: reports.find(report => report.productTypeId === product.id)
                };
              });
          });
      });
  }

  getDeviation(report: ProductReport) {
    return report.actualAmount - report.planAmount;
  }

  getDeviationInPercent(report: ProductReport) {
    return Math.abs(this.getDeviation(report) / report.planAmount * 100).toFixed(1);
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

  private computeTotal(reports: ProductReport[]) {
    this.totalReport.actualAmount = 0;
    this.totalReport.planAmount = 0;
    reports.forEach(report => {
      this.totalReport.actualAmount += report.actualAmount;
      this.totalReport.planAmount += report.planAmount;
    });
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

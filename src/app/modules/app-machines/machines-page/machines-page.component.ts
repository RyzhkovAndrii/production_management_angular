import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDialogService } from '../../../../../node_modules/ngx-modal-dialog';
import { Observable, Subject } from '../../../../../node_modules/rxjs';
import * as moment from 'moment';

import { StandardsService } from '../../app-standards/services/standards.service';
import { ProductsPlanService } from '../../app-products-plan/services/products-plan.service';
import { formatDateBrowserToServer, formatDateServerToBrowser, getDate } from '../../../app-utils/app-date-utils';
import { AppModalService } from '../../app-shared/services/app-modal.service';
import { MachineModuleStoreDataService } from '../services/machine-module-store-data.service';
import { MachineModuleCasheService } from '../services/machine-module-cashe.service';
import { compareProductTypes } from '../../../app-utils/app-comparators';

@Component({
  selector: 'app-machines-page',
  templateUrl: './machines-page.component.html',
  styleUrls: ['./machines-page.component.css']
})
export class MachinesPageComponent implements OnInit, OnDestroy {

  hours: number[];
  selectedDate: Date = new Date();

  standards: Standard[] = [];
  productTypes: ProductTypeResponse[] = [];

  dailyPlans: ProductPlanBatchResponse[] = [];

  dateForm = new FormGroup({
    'date': new FormControl(formatDateServerToBrowser(this.selectedDate), [Validators.required])
  });

  isFetched = false;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private standardService: StandardsService,
    private productPlanSerivce: ProductsPlanService,
    private casheService: MachineModuleCasheService,
    private dataService: MachineModuleStoreDataService,
    private viewRef: ViewContainerRef,
    private ngxModalDialogService: ModalDialogService,
    private appModalService: AppModalService
  ) {
    this.hours = Array(24).fill(0).map((x, i) => {
      return i < 16 ? i + 8 : i - 16;
    });
  }

  ngOnInit() {
    this.fetchData();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  fetchData() {
    this.isFetched = false;
    this.productPlanSerivce
      .getBatches(formatDateBrowserToServer(this.selectedDate))
      .subscribe(
        response => {
          this.dailyPlans = response.filter(productPlan => productPlan.manufacturedAmount !== 0);
          this.dataService.setDailyPlan(this.dailyPlans);
          if (this.dailyPlans.length !== 0) {
            Observable
              .combineLatest(this.fetchDailyStandards(), this.fetchDailyProductPlans())
              .takeUntil(this.ngUnsubscribe)
              .subscribe(() => {
                this.isFetched = true;
              });
          } else {
            this.isFetched = true;
          }
        },
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
      );
  }

  dateChange(daysChange: number) {
    const { date } = this.dateForm.value;
    this.selectedDate = (daysChange === null)
      ? getDate(date)
      : moment(date, 'YYYY-MM-DD').add(daysChange, 'days').toDate();
    this.dateForm.get('date').patchValue(formatDateServerToBrowser(this.selectedDate));
    this.fetchData();
  }

  private fetchDailyStandards(): Observable<any> {
    const result = new Subject<any>();
    const obsBatch: Observable<any>[] = [];
    this.dailyPlans.forEach(plan => obsBatch.push(this.standardService.getStandard(plan.productTypeId)));
    Observable
      .forkJoin(obsBatch)
      .takeUntil(this.ngUnsubscribe)
      .delay(1) // todo change
      .subscribe(
        response => {
          response.forEach(standard => this.standards.push(standard));
          result.next();
        },
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
      );
    return result.asObservable();
  }

  private fetchDailyProductPlans(): Observable<any> {
    this.productTypes = [];
    const result = new Subject<any>();
    const obsBatch: Observable<any>[] = [];
    this.dailyPlans.forEach(plan => obsBatch.push(this.casheService.getProductType(plan.productTypeId)));
    Observable
      .forkJoin(obsBatch)
      .takeUntil(this.ngUnsubscribe)
      .delay(1) // todo change
      .subscribe(
        response => {
          response.forEach(type => this.productTypes.push(type));
          this.productTypes.sort(compareProductTypes);
          this.dataService.setDailyProductTypes(this.productTypes);
          result.next();
        },
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
      );
    return result.asObservable();
  }

}

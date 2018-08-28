import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDialogService } from '../../../../../node_modules/ngx-modal-dialog';
import { Observable } from '../../../../../node_modules/rxjs';
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
export class MachinesPageComponent implements OnInit {

  selectedDate: Date;

  dateForm: FormGroup;

  isFetched = false;

  constructor(
    private standardService: StandardsService,
    private productPlanSerivce: ProductsPlanService,
    private casheService: MachineModuleCasheService,
    private dataService: MachineModuleStoreDataService,
    private viewRef: ViewContainerRef,
    private ngxModalDialogService: ModalDialogService,
    private appModalService: AppModalService
  ) { }

  ngOnInit() {
    this.dataService.getCurrentDate().subscribe(date => {
      this.selectedDate = date;
      this.dateForm = new FormGroup({
        'date': new FormControl(formatDateServerToBrowser(date), [Validators.required])
      });
    });
    this.fetchData();
  }

  changeDate(daysChange: number) {
    const { date } = this.dateForm.value;
    this.selectedDate = (daysChange === null)
      ? getDate(date)
      : moment(date, 'YYYY-MM-DD').add(daysChange, 'days').toDate();
    this.dateForm.get('date').patchValue(formatDateServerToBrowser(this.selectedDate));
    this.dataService.setCurrentDate(this.selectedDate);
    this.fetchData();
  }

  private fetchData() {
    this.isFetched = false;
    this.productPlanSerivce
      .getBatches(formatDateBrowserToServer(this.selectedDate))
      .map(productPlans => productPlans.filter(productPlan => productPlan.manufacturedAmount !== 0))
      .do(productPlans => this.dataService.setDailyPlan(productPlans))
      .flatMap(productPlans => Observable.forkJoin(this.fetchDailyStandards(productPlans), this.fetchDailyProductPlans(productPlans)))
      .subscribe(
        () => this.isFetched = true,
        // todo added auto open error window
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
      );
  }

  private fetchDailyStandards(dailyPlans: ProductPlanBatchResponse[]): Observable<Standard[]> {
    return dailyPlans.length === 0
      ? Observable.of([])
      : Observable
        .forkJoin(
          dailyPlans.map(plan => this.standardService.getStandard(plan.productTypeId))
        )
        .do(standards => this.dataService.setStandards(standards));
  }

  private fetchDailyProductPlans(dailyPlans: ProductPlanBatchResponse[]): Observable<ProductTypeResponse[]> {
    return dailyPlans.length === 0
      ? Observable.of([])
      : Observable
        .forkJoin(
          dailyPlans.map(plan => this.casheService.getProductType(plan.productTypeId))
        )
        .map(types => types.sort(compareProductTypes))
        .do(types => this.dataService.setDailyProductTypes(types));
  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from '../../../../../node_modules/rxjs';
import * as moment from 'moment';

import { StandardsService } from '../../app-standards/services/standards.service';
import { ProductsPlanService } from '../../app-products-plan/services/products-plan.service';
import { formatDateBrowserToServer, formatDateServerToBrowser, getDate } from '../../../app-utils/app-date-utils';
import { MachineModuleStoreDataService } from '../services/machine-module-store-data.service';
import { MachineModuleCasheService } from '../services/machine-module-cashe.service';
import { compareProductTypes } from '../../../app-utils/app-comparators';
import { AppHttpErrorService } from '../../app-shared/services/app-http-error.service';

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
    private httpErrorService: AppHttpErrorService
  ) { }

  ngOnInit() {
    this.dataService
      .getCurrentDate()
      .subscribe(date => {
        this.selectedDate = date;
        this.dateForm = new FormGroup({
          'date': new FormControl(formatDateServerToBrowser(date), [Validators.required])
        });
      });
    this.fetchData();
  }

  changeDate(daysChange = 0) {
    const { date } = this.dateForm.value;
    this.selectedDate = (daysChange === 0)
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
      .catch(err => this.httpErrorService.openHttpErrorWindow(err))
      .subscribe(() => this.isFetched = true);
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
      ? Observable.of([]).do(() => this.dataService.setDailyProductTypes([]))
      : Observable
        .forkJoin(
          dailyPlans.map(plan => this.casheService.getProductType(plan.productTypeId))
        )
        .map(types => types.sort(compareProductTypes))
        .do(types => this.dataService.setDailyProductTypes(types));
  }

}

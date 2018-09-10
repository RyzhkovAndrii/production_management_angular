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
import { AppModalService } from '../../app-shared/services/app-modal.service';

@Component({
  selector: 'app-machines-page',
  templateUrl: './machines-page.component.html',
  styleUrls: ['./machines-page.component.css']
})
export class MachinesPageComponent implements OnInit {

  private readonly machinesAmount = 3;
  machines: number[];

  selectedDate: Date;

  dateForm: FormGroup;

  isFetched = false;

  constructor(
    private standardService: StandardsService,
    private productPlanSerivce: ProductsPlanService,
    private casheService: MachineModuleCasheService,
    private dataService: MachineModuleStoreDataService,
    private modalService: AppModalService
  ) {
    this.machines = Array(this.machinesAmount).fill(0).map((x, i) => i + 1);
  }

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
      ? getDate(date, 'YYYY-MM-DD')
      : moment(date, 'YYYY-MM-DD').add(daysChange, 'days').toDate();
    this.dateForm.get('date').setValue(formatDateServerToBrowser(this.selectedDate));
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
      .catch(err => this.modalService.openHttpErrorWindow(err))
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

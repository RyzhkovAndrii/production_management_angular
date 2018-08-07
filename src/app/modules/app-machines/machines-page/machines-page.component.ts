import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDialogService } from '../../../../../node_modules/ngx-modal-dialog';
import * as moment from 'moment';

import { StandardsService } from '../../app-standards/services/standards.service';
import { ProductsPlanService } from '../../app-products-plan/services/products-plan.service';
import { Observable, Subject } from '../../../../../node_modules/rxjs';
import { formatDateBrowserToServer } from '../../../app-utils/app-date-utils';
import { AppModalService } from '../../app-shared/services/app-modal.service';

@Component({
  selector: 'app-machines-page',
  templateUrl: './machines-page.component.html',
  styleUrls: ['./machines-page.component.css']
})
export class MachinesPageComponent implements OnInit, OnDestroy {

  hours: number[];
  selectedDate: Date = new Date();

  standards: Standard[] = [];

  dailyPlans: ProductPlanBatchResponse[] = [];

  dateForm = new FormGroup({
    'date': new FormControl(moment().format('YYYY-MM-DD'), [Validators.required])
  })

  isFetched = false;

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private standardService: StandardsService,
    private productPlanSerivce: ProductsPlanService,
    private viewRef: ViewContainerRef,
    private ngxModalDialogService: ModalDialogService,
    private appModalService: AppModalService
  ) {
    this.hours = Array(24).fill(0).map((x, i) => {
      return i < 16 ? i + 8 : i - 16
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
    const obsBatch: Observable<any>[] = [];
    this.productPlanSerivce
      .getBatches(formatDateBrowserToServer(this.selectedDate))
      .subscribe(
        response => {
          this.dailyPlans = response.filter(productPlan => productPlan.manufacturedAmount !== 0);
          this.dailyPlans.forEach(plan => obsBatch.push(this.standardService.getStandard(plan.productTypeId)));
          if (obsBatch.length === 0) {
            this.isFetched = true;
          } else {
            Observable
              .forkJoin(obsBatch)
              .takeUntil(this.ngUnsubscribe)
              .subscribe(
                response => {
                  response.forEach(standard => this.standards.push(standard));
                  this.isFetched = true;
                },
                error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
              );
          }
        },
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
      )
  }

  dateChange() {
    const { date } = this.dateForm.value;
    this.selectedDate = date;
    this.fetchData();
  }

}

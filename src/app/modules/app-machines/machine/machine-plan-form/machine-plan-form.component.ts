import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable, Subject, BehaviorSubject } from '../../../../../../node_modules/rxjs';
import * as moment from 'moment';

import { MachinePlan } from '../../models/machine-plan.model';
import { MachineModuleStoreDataService } from '../../services/machine-module-store-data.service';
import { MachinePlanItem } from '../../models/machine-plan-item.model';
import { MachinePlanFormService } from '../../services/machine-plan-form.service';
import { RollTableComponent } from './roll-table/roll-table.component';

@Component({
  selector: 'app-machine-plan-form',
  templateUrl: './machine-plan-form.component.html',
  styleUrls: ['./machine-plan-form.component.css']
})
export class MachinePlanFormComponent implements OnInit, OnDestroy {

  private readonly DATE_TIME_FORMAT = 'DD-MM-YYYY HH:mm:SS';
  private readonly TIME_FORMAT = 'HH:mm';

  @ViewChild(RollTableComponent) rollTable: RollTableComponent;

  @Input() machinePlans$: Observable<MachinePlan[]>;
  @Input() currentIndex: number;
  @Input() machineNumber: number;

  @Output() cancel = new EventEmitter<any>();
  @Output() submit = new EventEmitter<MachinePlan>();

  date: Date;
  machinePlans: MachinePlan[];
  standards: Standard[];
  dailyProductTypes: ProductTypeResponse[];

  current: MachinePlan;
  before: MachinePlan;
  after: MachinePlan;

  isUpdating = false;

  currentAmount: number;
  currentStartTime: Date;
  currentFinishTime: Date;
  currentStandard: Standard;
  currentPlanOperations: ProductPlanOperationResponse[] = [];

  minTime: Date;
  maxTime: Date;

  currentRolls$: Observable<RollType[]>;

  planForm: FormGroup;

  // todo check all components on unsubscribe
  private ngUnsubscribe: Subject<any> = new Subject();

  isFetched = false;
  isTable = false;

  productTypeSubject = new BehaviorSubject<ProductTypeResponse>(null);
  productType$ = this.productTypeSubject.asObservable();

  constructor(
    private machinePlanFormService: MachinePlanFormService,
    private dataService: MachineModuleStoreDataService,
  ) {
    this.planForm = this.machinePlanFormService.initPlanForm();
  }

  ngOnInit() {
    Observable.combineLatest(
      this.dataService.getCurrentDate(),
      this.dataService.getStandards(),
      this.dataService.getDailyProductTypes(),
      this.machinePlans$
    )
      .takeUntil(this.ngUnsubscribe)
      .subscribe(data => {
        this.date = data[0];
        this.standards = data[1];
        this.dailyProductTypes = data[2];
        this.machinePlans = data[3];
        this.initData();
        this.initForm();
        this.isFetched = true; // todo add loading
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    const plan = this.getPlan();
    this.submit.emit(plan);
  }

  onCancel() {
    this.cancel.emit();
  }

  private initData() {
    this.current = this.machinePlans[this.currentIndex];
    this.before = (this.currentIndex !== 0) ? this.machinePlans[this.currentIndex - 1] : null;
    this.after = (this.currentIndex !== this.machinePlans.length - 1) ? this.machinePlans[this.currentIndex + 1] : null;
    this.isUpdating = (this.current.productTypeId !== undefined);
    const dayStart = moment(this.date).startOf('days').add(8, 'hours').toDate();
    const dayEnd = moment(this.date).endOf('days').add(8, 'hours').toDate();
    this.minTime = this.before ? this.getTime(this.before.timeStart, this.before.duration) : dayStart;
    this.maxTime = this.after ? this.getTime(this.after.timeStart) : dayEnd;
    this.currentStartTime = this.isUpdating ? this.getTime(this.current.timeStart) : this.minTime;
    this.currentFinishTime = this.isUpdating ? this.getTime(this.current.timeStart, this.current.duration) : this.currentStartTime;
    this.currentAmount = this.current ? this.current.productAmount : 0;
  }

  private initForm() {
    const defaultStartChangeTime = 30;
    const productTypeId = this.isUpdating ? this.current.productTypeId : null;
    this.planForm = new FormGroup(
      {
        'productType': new FormControl(productTypeId, [Validators.required]),
        'startTime': new FormControl(this.currentStartTime, [Validators.required]),
        'startChange': new FormControl(defaultStartChangeTime, [Validators.required]),
        'finishTime': new FormControl(this.currentFinishTime, [Validators.required]),
        'amount': new FormControl(this.currentAmount, [Validators.required]),
      });
  }

  private getPlan(): MachinePlan {
    const { productType } = this.planForm.value;
    const plan = this.isUpdating ? this.current : new MachinePlan();
    plan.machineNumber = this.machineNumber;
    plan.productTypeId = productType;
    plan.timeStart = moment(this.currentStartTime).format(this.DATE_TIME_FORMAT);
    plan.isImportant = true; // todo form value
    plan.planItems = this.getPlanItems();
    return plan;
  }

  private getPlanItems(): MachinePlanItem[] {
    return this.rollTable.planItems
      .filter(i => i.rollAmount > 0)
      .map(i => {
        const item = new MachinePlanItem();
        item.rollTypeId = i.roll.id;
        item.rollAmount = i.rollAmount;
        item.productAmount = i.productAmount;
        return item;
      });
  }

  setProductType() {
    const { productType } = this.planForm.value;
    const type = productType ? this.dailyProductTypes.find(t => t.id === productType) : null;
    this.productTypeSubject.next(type);
    this.currentStandard = type ? this.standards.find(standard => standard.productTypeId === type.id) : null;
  }

  updateAmount(amount: number) {
    this.currentAmount = amount;
    this.updateFinishTime();
  }

  updateFinishTime() {
    if (this.currentStandard) {
      const normForHour = this.currentStandard.normForDay / 24;
      const duration = this.currentAmount / normForHour;
      this.currentFinishTime = this.getTime(this.currentStartTime, duration);
    } else {
      this.currentFinishTime = this.currentStartTime;
    }
  }

  changeCurrentStartTime() {
    const { startTime, startChange } = this.planForm.value;
    const momentStart = moment(startTime, this.TIME_FORMAT);
    this.currentStartTime = moment(this.currentStartTime)
      .startOf('day')
      .add(momentStart.get('hour'), 'hours')
      .add(momentStart.get('minute'), 'minutes')
      .add(startChange, 'minutes')
      .toDate();
    this.updateFinishTime();
  }

  private getTime(startTime: string | Date, hourInterval = 0) {
    const time = (startTime instanceof Date) ? moment(startTime) : moment(startTime, this.DATE_TIME_FORMAT);
    time.add(hourInterval, 'hours');
    return time.toDate();
  }

}

import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { Observable, Subject, BehaviorSubject } from '../../../../../../node_modules/rxjs';
import * as moment from 'moment';

import { MachinePlan } from '../../models/machine-plan.model';
import { MachineModuleStoreDataService } from '../../services/machine-module-store-data.service';
import { MachinePlanItem } from '../../models/machine-plan-item.model';
import { RollTableComponent } from './roll-table/roll-table.component';

@Component({
  selector: 'app-machine-plan-form',
  templateUrl: './machine-plan-form.component.html',
  styleUrls: ['./machine-plan-form.component.css']
})
export class MachinePlanFormComponent implements OnInit, OnDestroy {

  private readonly DATE_TIME_FORMAT = 'DD-MM-YYYY HH:mm:SS';
  private readonly TIME_FORMAT = 'HH:mm';
  readonly machineRestMinutes = 30;

  @ViewChild(RollTableComponent) rollTable: RollTableComponent;
  @ViewChild('select') select;

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

  isFetched = false;
  isTable = false;
  isTableLoaded = false;

  startTimeError: string;
  finishTimeError: string;
  startTimeWarning: string;
  finishTimeWarning: string;

  productTypeSubject = new BehaviorSubject<ProductTypeResponse>(null);
  productType$ = this.productTypeSubject.asObservable();

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private dataService: MachineModuleStoreDataService,
  ) { }

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
    const productType = this.isUpdating ? this.current.productType : null;
    this.productTypeSubject.next(productType);
    this.currentStandard = productType ? this.standards.find(standard => standard.productTypeId === productType.id) : null;
    this.validateStartTime();
    this.validateFinishTime();
  }

  private initForm() {
    const productTypeId = this.isUpdating ? this.current.productTypeId : null;
    const important = this.isUpdating ? this.current.isImportant : false;
    this.planForm = new FormGroup(
      {
        'important': new FormControl(important),
        'productType': new FormControl(productTypeId, [Validators.required]),
        'startTime': new FormControl(this.currentStartTime),
        'startChange': new FormControl(this.machineRestMinutes),
        'finishTime': new FormControl(this.currentFinishTime),
        'amount': new FormControl(this.currentAmount, [Validators.required, Validators.min(0)]),
      });
  }

  private getPlan(): MachinePlan {
    const { productType, important } = this.planForm.value;
    const plan = new MachinePlan();
    plan.id = this.isUpdating ? this.current.id : null;
    plan.machineNumber = this.machineNumber;
    plan.productTypeId = productType;
    plan.timeStart = moment(this.currentStartTime).format(this.DATE_TIME_FORMAT);
    plan.isImportant = important;
    plan.planItems = this.getPlanItems();
    return plan;
  }

  private getPlanItems(): MachinePlanItem[] {
    return this.rollTable.planItems
      .filter(i => i.rollAmount > 0)
      .map(i => {
        const currItem = this.isUpdating
          ? this.current.planItems.find(currentItem => currentItem.rollTypeId === i.rollType.id)
          : null;
        const item = new MachinePlanItem();
        item.id = currItem ? currItem.id : null;
        item.rollTypeId = i.rollType.id;
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
    this.validateFinishTime();
  }

  updateStartTime() {
    const { startTime } = this.planForm.value;
    if (startTime) {
      const momentStart = moment(startTime, this.TIME_FORMAT);
      const addedDays = momentStart.get('hour') < 8 ? 1 : 0;
      this.currentStartTime = moment(this.date)
        .startOf('day')
        .add(momentStart.get('hour'), 'hours')
        .add(momentStart.get('minute'), 'minutes')
        .add(addedDays, 'days')
        .toDate();
    } else {
      this.currentStartTime = this.minTime;
      this.planForm.get('startTime').setValue(moment(this.minTime).format(this.TIME_FORMAT));
    }
    this.validateStartTime();
    this.updateFinishTime();
  }

  changeCurrentStartTime() {
    const { startTime, startChange } = this.planForm.value;
    const momentStart = moment(startTime, this.TIME_FORMAT);
    const startWithChange = momentStart.add(startChange, 'minutes').format(this.TIME_FORMAT);
    this.planForm.get('startTime').setValue(startWithChange);
    this.updateStartTime();
  }

  private getTime(startTime: string | Date, hourInterval = 0) {
    const time = (startTime instanceof Date) ? moment(startTime) : moment(startTime, this.DATE_TIME_FORMAT);
    time.add(hourInterval, 'hours');
    return time.toDate();
  }

  private getDateTimeDiffMinutes(d1: Date, d2: Date): number {
    return Math.round((d2.valueOf() - d1.valueOf()) / 1000 / 60);
  }

  private getDateTimeDiff(d1: Date, d2: Date): number {
    return (d2.valueOf() - d1.valueOf()) / 1000;
  }

  private validateStartTime() {
    this.startTimeError = null;
    this.startTimeWarning = null;
    const diff = this.getDateTimeDiffMinutes(this.minTime, this.currentStartTime);
    this.startTimeError = diff < 0 ? 'время начала выходит за границы выбранного периода' : null;
    this.startTimeWarning = diff < this.machineRestMinutes && diff >= 0 && this.before
      ? `перерыв между предыдущим и текущим планами составляет ${diff} мин.`
      : null;
  }

  private validateFinishTime() {
    this.finishTimeError = null;
    this.finishTimeWarning = null;
    const diff = this.getDateTimeDiff(this.currentFinishTime, this.maxTime);
    const diffMin = this.getDateTimeDiffMinutes(this.minTime, this.currentStartTime);
    this.finishTimeError = diff < 0 ? 'время окончания выходит за границы выбранного периода' : null;
    this.finishTimeWarning = diffMin < this.machineRestMinutes && diff >= 0 && this.after
      ? `перерыв между текущим и последующим планами составляет ${diffMin} мин.`
      : null;
  }

  isProductTypeSelectedValid() {
    return !this.planForm.hasError('required', ['productType']);
  }

  isFormValid() {
    return !this.startTimeError
      && !this.finishTimeError
      && this.isProductTypeSelectedValid()
      && this.currentAmount > 0;
  }

}

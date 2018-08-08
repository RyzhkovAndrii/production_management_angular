import { Component, OnInit, Output, EventEmitter, Input, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDialogService } from '../../../../../../node_modules/ngx-modal-dialog';
import * as moment from 'moment';

import { MachinePlanItem } from '../../models/machine-plan-item.model';
import { MachineService } from '../../services/machine.service';
import { AppModalService } from '../../../app-shared/services/app-modal.service';

@Component({
  selector: 'app-machine-item-form',
  templateUrl: './machine-item-form.component.html',
  styleUrls: ['./machine-item-form.component.css']
})
export class MachineItemFormComponent implements OnInit {

  private readonly DECIMAL_PLACES = 3;

  @Input() machinePlan: MachinePlanItem[];
  @Input() currentIndex: number;
  @Input() date: Date;
  @Input() machineNumber: number;
  norm: number = 12500;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<MachinePlanItem>();

  current: MachinePlanItem;
  before: MachinePlanItem;
  after: MachinePlanItem;

  currentAmount: number;

  form: FormGroup;

  constructor(
    private machineService: MachineService,
    private viewRef: ViewContainerRef,
    private ngxModalDialogService: ModalDialogService,
    private appModalService: AppModalService
  ) { }

  ngOnInit() {
    this.setPlanItems();
    this.setInitialFormValues();
  }

  cancel() {
    this.onCancel.emit();
  }

  submit() {
    const { startTime, amount } = this.form.value;
    const momentStartTime = moment(startTime, 'HH:mm:ss');
    let startDateAndTime = moment(this.date);
    startDateAndTime = startDateAndTime.set({
      'hour': momentStartTime.hours(),
      'minute': momentStartTime.minutes(),
      'second': momentStartTime.seconds()
    })
    if (startDateAndTime.hours() < 8) {
      startDateAndTime = startDateAndTime.add(1, 'days');
    }
    const planItem = new MachinePlanItem();
    planItem.machineNumber = this.machineNumber;
    planItem.productTypeId = 1; // todo change
    planItem.productAmount = amount * Math.pow(10, this.DECIMAL_PLACES);
    planItem.timeStart = startDateAndTime.format('DD-MM-YYYY HH:mm:ss');
    this.machineService.save(planItem)
      .subscribe(
        response => this.onSubmit.emit(response),
        error => this.appModalService.openHttpErrorModal(this.ngxModalDialogService, this.viewRef, error)
      );
  }

  isEmpty(planItem: MachinePlanItem) {
    return planItem.productTypeId === undefined;
  }

  private setPlanItems() {
    this.current = this.machinePlan[this.currentIndex];
    if (this.currentIndex !== 0) {
      this.before = this.machinePlan[this.currentIndex - 1];
    }
    if (this.currentIndex !== this.machinePlan.length - 1) {
      this.after = this.machinePlan[this.currentIndex + 1];
    }
  }

  private setInitialFormValues() {
    this.form = new FormGroup({
      'startTime': new FormControl(this.startTime, [Validators.required]),
      'startChange': new FormControl(30, [Validators.required]),
      'finishTime': new FormControl(this.finishTime, [Validators.required]),
      'finishChange': new FormControl(30, [Validators.required]),
      'amount': new FormControl(this.getStrDecNumber(this.current.productAmount), [Validators.required])
    });
  }

  private get startTime() {
    if (!this.isEmpty(this.current)) {
      return this.getTime(this.current.timeStart);
    }
    if (this.before && !this.isEmpty(this.before)) {
      return this.getTime(this.before.timeStart, this.before.duration);
    }
    return '00:00:00';
  }

  private get finishTime() {
    if (!this.isEmpty(this.current)) {
      return this.getTime(this.current.timeStart, this.current.duration);
    }
    if (this.after && !this.isEmpty(this.after)) {
      return this.getTime(this.after.timeStart);
    }
    return '23:59:59';
  }

  private getTime(startTime: string | Date, hourInterval = 0) {
    const format = 'DD-MM-YYYY HH:mm:ss';
    const time = (startTime instanceof Date) ? moment(startTime) : moment(startTime, format);
    time.add(hourInterval, 'hours');
    return time.format('HH:mm:ss');
  }

  changeCurrentStartTime() {
    const { startTime, startChange } = this.form.value;
    const format = 'HH:mm:ss';
    const newStartTime = moment(startTime, format).add(startChange, 'minutes').format(format);
    this.form.get('startTime').patchValue(newStartTime);
    this.changeAmount();
  }

  minCurrentStartTime() {
    this.form.get('startTime').patchValue(this.startTime); // todo change method for update
    this.changeAmount();
  }

  changeCurrentFinishTime() {
    const { finishTime, finishChange } = this.form.value;
    const format = 'HH:mm:ss';
    const newFinishTime = moment(finishTime, format).add((-1) * finishChange, 'minutes').format(format);
    this.form.get('finishTime').patchValue(newFinishTime);
    this.changeAmount();
  }

  maxCurrentFinishTime() {
    this.form.get('finishTime').patchValue(this.finishTime); // todo change method for update
    this.changeAmount();
  }

  private getDuration(startTime: string, finishTime: string) {
    const format = 'HH:mm:ss';
    const start = moment(startTime, format);
    const finish = moment(finishTime, format);
    return moment.duration(finish.diff(start)).asHours();
  }

  changeAmount() {
    const { startTime, finishTime } = this.form.value;
    const amount = this.getDuration(startTime, finishTime) * this.norm;
    this.form.get('amount').patchValue(this.getStrDecNumber(amount));
  }

  changeFinishTime() {
    const format = 'HH:mm:ss';
    const { startTime, amount } = this.form.value;
    const integerAmount = parseFloat(amount) * Math.pow(10, this.DECIMAL_PLACES);
    const duration = integerAmount / this.norm;
    const newTime = moment(startTime, format).add(duration, 'hours').format(format);
    this.form.get('finishTime').patchValue(newTime);
  }

  setExponent($event) {
    $event.target.value = parseFloat($event.target.value).toFixed(3);
  }

  private getStrDecNumber(num: number): string {
    return (num / Math.pow(10, this.DECIMAL_PLACES)).toFixed(this.DECIMAL_PLACES);
  }

}

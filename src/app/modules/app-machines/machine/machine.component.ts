import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MachinePlanService } from '../services/machine-plan.service';
import { MachinePlan } from '../models/machine-plan.model';
import { MachineModuleStoreDataService } from '../services/machine-module-store-data.service';
import { compareDateTimes } from '../../../app-utils/app-comparators';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.css'],
})
export class MachineComponent implements OnInit {

  @Input() machineNumber: number;

  machinePlans: MachinePlan[];
  machinePlansSubject = new BehaviorSubject<MachinePlan[]>([]);
  machinePlans$: Observable<MachinePlan[]> = this.machinePlansSubject.asObservable();
  machinePlansWithItems$: Observable<MachinePlan[]>;
  machinePlansWithEmpty$: Observable<MachinePlan[]>;
  machinePlansWithItemsWithEmpty$: Observable<MachinePlan[]>;

  currentMachinePlan: number;

  isMachinePlanFormVisible = false;
  isTableVisible = false;
  wasTableOpened = false;
  isFetched = false;
  isRemoving = false;

  constructor(
    private machinePlanService: MachinePlanService,
    private dataService: MachineModuleStoreDataService
  ) { }

  ngOnInit() {
    this.dataService
      .getCurrentDate()
      .flatMap(currentDate => this.machinePlanService.getAll(currentDate, this.machineNumber))
      .subscribe(data => {
        this.machinePlans = data;
        this.machinePlansSubject.next(data);
        this.isFetched = true;
      });
    this.machinePlans$ = this.machinePlanService.addProductTypes(this.machinePlans$);
    this.machinePlansWithItems$ = this.machinePlanService.addItems(this.machinePlans$);
    this.machinePlansWithEmpty$ = this.machinePlanService.addEmptyPlans(this.machinePlans$);
    this.machinePlansWithItemsWithEmpty$ = this.machinePlanService.addEmptyPlans(this.machinePlansWithItems$);
  }

  removePlan(plan: MachinePlan) {
    this.isRemoving = true;
    this.machinePlanService
      .delete(plan.id)
      .subscribe(() => {
        this.machinePlans = this.machinePlans.filter(p => p !== plan);
        this.machinePlansSubject.next(this.machinePlans);
        this.dataService.updateDailyPlan(plan, null);
        this.isRemoving = false;
      });
  }

  addPlan(plan: MachinePlan) {
    this.machinePlanService
      .saveWithItems(plan)
      .subscribe(res => {
        this.machinePlans.push(res);
        this.machinePlans.sort((p1, p2) => compareDateTimes(p1.timeStart, p2.timeStart));
        this.machinePlansSubject.next(this.machinePlans);
        this.dataService.updateDailyPlan(null, plan);
      });
  }

  openMachinePlanForm(index: number) {
    this.currentMachinePlan = index;
    this.isMachinePlanFormVisible = true;
  }

  submitMachinePlanForm(plan: MachinePlan) {
    this.machinePlans.push(plan);
    this.machinePlans.sort((a, b) => compareDateTimes(a.timeStart, b.timeStart));
    this.isMachinePlanFormVisible = false;
  }

  cancelMachinePlanForm() {
    this.isMachinePlanFormVisible = false;
  }

  toggleTableVisible() {
    if (!this.isTableVisible) {
      this.wasTableOpened = true;
    }
    this.isTableVisible = !this.isTableVisible;
  }

}

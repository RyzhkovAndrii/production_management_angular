import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { MachinePlan } from '../../models/machine-plan.model';
import { MachinePlanService } from '../../services/machine-plan.service';
import { MachineModuleStoreDataService } from '../../services/machine-module-store-data.service';
import { compareDateTimes } from '../../../../app-utils/app-comparators';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.css'],
})
export class MachineComponent implements OnInit, OnDestroy {

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

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private machinePlanService: MachinePlanService,
    private dataService: MachineModuleStoreDataService
  ) { }

  ngOnInit() {
    this.dataService
      .getCurrentDate()
      .flatMap(currentDate => this.machinePlanService.getAll(currentDate, this.machineNumber))
      .takeUntil(this.ngUnsubscribe)
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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

  submitlMachinePlanForm(plan: MachinePlan) {
    (plan.id) ? this.updatePlan(plan) : this.addPlan(plan);
  }

  private addPlan(plan: MachinePlan) {
    this.machinePlanService
      .saveWithItems(plan)
      .subscribe(res => {
        this.machinePlans.push(res);
        this.machinePlans.sort((p1, p2) => compareDateTimes(p1.timeStart, p2.timeStart));
        this.machinePlansSubject.next(this.machinePlans);
        this.dataService.updateDailyPlan(null, res);
        this.isMachinePlanFormVisible = false;
      });
  }

  private updatePlan(plan: MachinePlan) {
    const i = this.machinePlans.findIndex(p => p.id === plan.id);
    const oldPlan = this.machinePlans[i];
    this.machinePlanService
      .updateWithItems(oldPlan, plan)
      .subscribe(res => {
        this.machinePlans[i] = res;
        this.machinePlansSubject.next(this.machinePlans);
        this.dataService.updateDailyPlan(oldPlan, res);
        this.isMachinePlanFormVisible = false;
      });
  }

  openMachinePlanForm(index: number) {
    this.currentMachinePlan = index;
    this.isMachinePlanFormVisible = true;
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

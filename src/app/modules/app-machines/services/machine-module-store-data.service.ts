import { Injectable } from '@angular/core';
import { BehaviorSubject } from '../../../../../node_modules/rxjs';
import { MachinePlan } from '../models/machine-plan.model';

@Injectable()
export class MachineModuleStoreDataService {

    private dailyProductTypesSource = new BehaviorSubject<ProductTypeResponse[]>([]);
    private dailyPlanSource = new BehaviorSubject<ProductPlanBatchResponse[]>([]);
    private standardsSource = new BehaviorSubject<Standard[]>([]);
    private currentDateSource = new BehaviorSubject<Date>(new Date());

    constructor() { }

    getDailyPlan() {
        return this.dailyPlanSource.asObservable();
    }

    setDailyPlan(dailyPlan: ProductPlanBatchResponse[]) {
        this.dailyPlanSource.next(dailyPlan);
    }

    updateDailyPlan(oldPlan: MachinePlan, newPlan: MachinePlan) {
        const dailyPlan = this.dailyPlanSource.value;
        if (oldPlan) {
            const i = dailyPlan.findIndex(p => p.productTypeId === oldPlan.productTypeId);
            dailyPlan[i].productToMachinePlane -= oldPlan.productAmount;
        }
        if (newPlan) {
            const i = dailyPlan.findIndex(p => p.productTypeId === newPlan.productTypeId);
            dailyPlan[i].productToMachinePlane += newPlan.productAmount;
        }
        this.setDailyPlan(dailyPlan);
    }

    equalizeDailyPlan(plan: ProductPlanBatchResponse) {
        const dailyPlan = this.dailyPlanSource.value;
        const i = dailyPlan.findIndex(p => p.productTypeId === plan.productTypeId);
        dailyPlan[i].manufacturedAmount = dailyPlan[i].productToMachinePlane;
        this.setDailyPlan(dailyPlan);
    }

    getDailyProductTypes() {
        return this.dailyProductTypesSource.asObservable();
    }

    setDailyProductTypes(types: ProductTypeResponse[]) {
        this.dailyProductTypesSource.next(types);
    }

    getStandards() {
        return this.standardsSource.asObservable();
    }

    setStandards(standards: Standard[]) {
        this.standardsSource.next(standards);
    }

    getCurrentDate() {
        return this.currentDateSource.asObservable();
    }

    setCurrentDate(date: Date) {
        this.currentDateSource.next(date);
    }

}

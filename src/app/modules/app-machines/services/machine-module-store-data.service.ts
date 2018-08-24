import { Injectable } from '@angular/core';
import { BehaviorSubject } from '../../../../../node_modules/rxjs';

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

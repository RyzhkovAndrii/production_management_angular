import { Injectable } from '@angular/core';
import { BehaviorSubject } from '../../../../../node_modules/rxjs';
import { MachinePlan } from '../models/machine-plan.model';

@Injectable()
export class MachineModuleStoreDataService {

    private dailyProductTypesSource = new BehaviorSubject<ProductTypeResponse[]>([]);
    dailyProductTypes = this.dailyProductTypesSource.asObservable();

    private dailyPlanSource = new BehaviorSubject<ProductPlanBatchResponse[]>([]);

    constructor() { }

    setDailyProductTypes(types: ProductTypeResponse[]) {
        this.dailyProductTypesSource.next(types);
    }

    getDailyPlan() {
        return this.dailyPlanSource.asObservable();
    }

    setDailyPlan(dailyPlan: ProductPlanBatchResponse[]) {
        this.dailyPlanSource.next(dailyPlan);
    }

}

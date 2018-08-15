import { Injectable } from "@angular/core";
import { BehaviorSubject } from "../../../../../node_modules/rxjs";

@Injectable()
export class MachineModuleStoreDataService {

    private dailyProductTypesSource = new BehaviorSubject<ProductTypeResponse[]>([]);
    dailyProductTypes = this.dailyProductTypesSource.asObservable();

    constructor() { }

    setDailyProductTypes(types: ProductTypeResponse[]) {
        this.dailyProductTypesSource.next(types);
    }

}

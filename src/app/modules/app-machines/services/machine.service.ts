import { Injectable } from "@angular/core";
import { Observable } from "../../../../../node_modules/rxjs";
import { MachinePlanItem } from "../models/machine-plan-item.model";

@Injectable()
export class MachineService {

    machine1: MachinePlanItem[] = [
        {
            machineNumber: 1,
            timeStart: '31-07-2018 5:30',
            productType: 1,
            productAmount: 155000,
            duration: 8.0
        },
        {
            machineNumber: 1,
            timeStart: '31-07-2018 16:00',
            productType: 3,
            productAmount: 55000,
            duration: 2.0
        },
        {
            machineNumber: 1,
            timeStart: '31-07-2018 20:20',
            productType: 2,
            productAmount: 55000,
            duration: 3.5
        }
    ];

    machine2 = [
        {
            machineNumber: 2,
            timeStart: '31-07-2018 8:00',
            productType: 4,
            productAmount: 200000,
            duration: 10.5
        },
        {
            machineNumber: 2,
            timeStart: '31-07-2018 20:00',
            productType: 3,
            productAmount: 26000,
            duration: 1.0
        },
    ];

    constructor() { }

    getAll(machineNumber: number): Observable<MachinePlanItem[]> {
        if (machineNumber === 1) {
            return Observable.of(this.machine1);
        }
        if (machineNumber === 2) {
            Observable.of(this.machine1);
        }
        return Observable.of();
    }

}

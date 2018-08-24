import { Injectable } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { MachineModuleCasheService } from './machine-module-cashe.service';

@Injectable()
export class MachinePlanFormService {

    constructor(
        private fb: FormBuilder,
        private casheService: MachineModuleCasheService,
    ) { }

    getRollsFromStandard(standard: Standard): Observable<RollType[]> {
        const rollIds = standard.rollTypeIds;
        return rollIds.length === 0
            ? Observable.of([])
            : Observable.forkJoin(
                rollIds.map(id => this.casheService.getRollType(id))
            );
    }

    initPlanForm() {
        const defaultStartChangeTime = 30;
        return this.fb.group({
            'productType': [null, Validators.required],
            'startTime': [null, Validators.required],
            'startChange': [defaultStartChangeTime, Validators.required],
            'finishTime': [null, Validators.required],
            'amount': [null, Validators.required]
        });
    }

}

import { Injectable } from '@angular/core';
import { Observable } from '../../../../../node_modules/rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';

import appHeaders from '../../../app-utils/app-headers';
import { formatDate } from '../../../app-utils/app-date-utils';
import { MachinePlan } from '../models/machine-plan.model';
import { MachineModuleUrlService } from './machine-module-url.service';
import { MachinePlanItemService } from './machine-plan-item.service';
import { AppHttpErrorService } from '../../app-shared/services/app-http-error.service';

@Injectable()
export class MachinePlanService {

    constructor(
        private http: HttpClient,
        private planItemService: MachinePlanItemService,
        private urlService: MachineModuleUrlService,
        private httpErrorService: AppHttpErrorService
    ) { }

    getAll(date: Date, machineNumber: number): Observable<MachinePlan[]> {
        const params = new HttpParams()
            .set('sort', 'timeStart')
            .set('machine_number', machineNumber.toString())
            .set('date', formatDate(date));
        return this.http
            .get(this.urlService.machinePlanUrl, { params, headers: appHeaders })
            .catch(err => this.httpErrorService.openHttpErrorWindow(err));
    }

    getAllWithItems(date: Date, machineNumber: number): Observable<MachinePlan[]> {
        return this.getAll(date, machineNumber)
            .flatMap(plans => {
                return plans.length === 0
                    ? Observable.of([])
                    : Observable.forkJoin(
                        plans.map(plan => {
                            return this.planItemService
                                .getAll(plan.id)
                                .map(items => {
                                    plan.planItems = items;
                                    return plan;
                                });
                        })
                    );
            });
    }

    save(plan: MachinePlan): Observable<MachinePlan> {
        return this.http
            .post(this.urlService.machinePlanUrl, plan, { headers: appHeaders })
            .catch(err => this.httpErrorService.openHttpErrorWindow(err));
    }

    saveWithItems(plan: MachinePlan): Observable<MachinePlan> {
        return this.save(plan)
            .flatMap(planResp =>
                Observable
                    .forkJoin(plan.planItems.map(item => this.planItemService.save(planResp.id, item)))
                    .map(respItems => {
                        planResp.planItems = respItems;
                        return planResp;
                    })
            );
    }

    delete(id: number) {
        const url = `${this.urlService.machinePlanUrl}/${id}`;
        return this.http
            .delete(url, { headers: appHeaders })
            .catch(err => this.httpErrorService.openHttpErrorWindow(err));
    }

}

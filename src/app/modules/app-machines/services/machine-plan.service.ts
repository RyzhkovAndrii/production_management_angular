import { Injectable } from '@angular/core';
import { Observable } from '../../../../../node_modules/rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import * as moment from 'moment';

import appHeaders from '../../../app-utils/app-headers';
import { formatDate } from '../../../app-utils/app-date-utils';
import { MachinePlan } from '../models/machine-plan.model';
import { MachineModuleUrlService } from './machine-module-url.service';
import { MachinePlanItemService } from './machine-plan-item.service';
import { AppHttpErrorService } from '../../app-shared/services/app-http-error.service';
import { MachineModuleCasheService } from './machine-module-cashe.service';
import { MachineModuleStoreDataService } from './machine-module-store-data.service';

@Injectable()
export class MachinePlanService {

    private readonly DATE_TIME_FORMAT = 'DD-MM-YYYY HH:mm:ss';

    constructor(
        private http: HttpClient,
        private planItemService: MachinePlanItemService,
        private casheService: MachineModuleCasheService,
        private dataService: MachineModuleStoreDataService,
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

    getOne(id: number): Observable<MachinePlan> {
        const url = `${this.urlService.machinePlanUrl}/${id}`;
        return this.http
            .get(url, { headers: appHeaders })
            .catch(err => this.httpErrorService.openHttpErrorWindow(err));
    }

    save(plan: MachinePlan): Observable<MachinePlan> {
        return this.http
            .post(this.urlService.machinePlanUrl, plan, { headers: appHeaders })
            .catch(err => this.httpErrorService.openHttpErrorWindow(err));
    }

    update(plan: MachinePlan): Observable<MachinePlan> {
        const url = `${this.urlService.machinePlanUrl}/${plan.id}`;
        return this.http
            .put(url, plan, { headers: appHeaders })
            .catch(err => this.httpErrorService.openHttpErrorWindow(err));
    }

    delete(id: number) {
        const url = `${this.urlService.machinePlanUrl}/${id}`;
        return this.http
            .delete(url, { headers: appHeaders })
            .catch(err => this.httpErrorService.openHttpErrorWindow(err));
    }

    saveWithItems(plan: MachinePlan): Observable<MachinePlan> {
        return this.save(plan)
            .flatMap(planResp =>
                Observable
                    .forkJoin(plan.planItems.map(item => this.planItemService.save(planResp.id, item)))
                    .flatMap(items =>
                        this.getOne(planResp.id)
                            .map(newPlanResp => {
                                newPlanResp.planItems = items;
                                return newPlanResp;
                            })
                    )
            );
    }

    updateWithItems(oldPlan: MachinePlan, newPlan: MachinePlan): Observable<MachinePlan> {
        const addObs = newPlan.planItems
            .filter(item => !item.id)
            .map(item => this.planItemService.save(newPlan.id, item));
        const updObs = newPlan.planItems
            .filter(item => oldPlan.planItems.find(i => i.id === item.id) !== undefined)
            .map(item => this.planItemService.update(item));
        const delObs = oldPlan.planItems
            .filter(item => newPlan.planItems.find(i => i.id === item.id) === undefined)
            .map(item => this.planItemService.delete(item.id));
        return this.update(newPlan)
            .flatMap(planResp =>
                Observable
                    .forkJoin(
                        (addObs.length) ? Observable.forkJoin(addObs) : Observable.of([]),
                        (updObs.length) ? Observable.forkJoin(updObs) : Observable.of([]),
                        (delObs.length) ? Observable.forkJoin(delObs) : Observable.of([]),
                    )
                    .flatMap(data =>
                        this.getOne(planResp.id)
                            .map(newPlanResp => {
                                newPlanResp.planItems = data[0].concat(data[1]);
                                return newPlanResp;
                            })

                    )
            );
    }


    addProductTypes(plans$: Observable<MachinePlan[]>): Observable<MachinePlan[]> {
        return plans$.flatMap(plans => {
            return plans.length === 0
                ? Observable.of([])
                : Observable.forkJoin(
                    plans.map(plan => {
                        return this.casheService
                            .getProductType(plan.productTypeId)
                            .map(productType => {
                                plan.productType = productType;
                                return plan;
                            });
                    }));
        });
    }

    addItems(plans$: Observable<MachinePlan[]>): Observable<MachinePlan[]> {
        const withItems$ = plans$.flatMap(plans => {
            return plans.length === 0
                ? Observable.of([])
                : Observable.forkJoin(
                    plans.map(plan => {
                        return plan.planItems
                            ? Observable.of(plan)
                            : this.planItemService
                                .getAll(plan.id)
                                .map(items => {
                                    plan.planItems = items;
                                    return plan;
                                });
                    })
                );
        });
        return this.addRollTypes(withItems$);
    }

    private addRollTypes(plans$: Observable<MachinePlan[]>): Observable<MachinePlan[]> {
        return plans$.flatMap(plans => {
            return plans.length === 0
                ? Observable.of([])
                : Observable.forkJoin(
                    plans.map(plan =>
                        Observable.forkJoin(
                            plan.planItems.map(item => {
                                return this.casheService
                                    .getRollType(item.rollTypeId)
                                    .map(type => {
                                        item.rollType = type;
                                        return item;
                                    });
                            })
                        ).map(items => {
                            plan.planItems = items;
                            return plan;
                        })
                    )
                );
        });
    }

    addEmptyPlans(plans$: Observable<MachinePlan[]>): Observable<MachinePlan[]> {
        return this.dataService
            .getCurrentDate()
            .flatMap(date => plans$.map(plans => this._addEmptyPlans(date, plans)));
    }

    private _addEmptyPlans(date: Date, plans: MachinePlan[]): MachinePlan[] {
        const dateTimeFormat = 'DD-MM-YYYY HH:mm:SS';
        const plansWithEmplty: MachinePlan[] = [];
        const dayStart = moment(date).startOf('days').add(8, 'hours').format(dateTimeFormat);
        if (plans.length === 0) {
            const empty = this.getEmptyPlan(dayStart, 24);
            plansWithEmplty.push(empty);
            return plansWithEmplty;
        }
        let diff = this.getDiff(null, plans[0]);
        if (diff > 0) {
            const empty = this.getEmptyPlan(dayStart, diff);
            plansWithEmplty.push(empty);
        }
        for (let i = 0; i < plans.length; i++) {
            const p1 = plans[i];
            const p2 = i === plans.length - 1 ? null : plans[i + 1];
            plansWithEmplty.push(plans[i]);
            diff = this.getDiff(p1, p2);
            const startTime = this.getFromattedTime(p1.timeStart, p1.duration);
            if (diff > 0) {
                const empty = this.getEmptyPlan(startTime, diff);
                plansWithEmplty.push(empty);
            }
        }
        return plansWithEmplty;
    }

    private getEmptyPlan(timeStart: string, duration: number) {
        const empty = new MachinePlan();
        empty.timeStart = timeStart;
        empty.duration = duration;
        return empty;
    }

    private getDiff(p1: MachinePlan, p2: MachinePlan): number {
        const before = p1
            ? moment(p1.timeStart, this.DATE_TIME_FORMAT).add(p1.duration, 'hour')
            : moment(p2.timeStart, this.DATE_TIME_FORMAT).startOf('days').add(8, 'hours');
        const after = p2
            ? moment(p2.timeStart, this.DATE_TIME_FORMAT)
            : moment(p1.timeStart, this.DATE_TIME_FORMAT).endOf('days').add(8, 'hours');
        return moment.duration(after.diff(before)).asHours();
    }

    private getFromattedTime(startTime: string | Date, hourInterval = 0) {
        const time = (startTime instanceof Date) ? moment(startTime) : moment(startTime, this.DATE_TIME_FORMAT);
        time.add(hourInterval, 'hours');
        return time.format(this.DATE_TIME_FORMAT);
      }

}

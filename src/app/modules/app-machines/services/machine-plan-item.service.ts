import { Injectable } from '@angular/core';
import { Observable } from '../../../../../node_modules/rxjs';
import { HttpClient } from '@angular/common/http';

import appHeaders from '../../../app-utils/app-headers';
import { MachineModuleUrlService } from './machine-module-url.service';
import { MachinePlanItem } from '../models/machine-plan-item.model';
import { AppModalService } from '../../app-shared/services/app-modal.service';

@Injectable()
export class MachinePlanItemService {

    constructor(
        private http: HttpClient,
        private urlService: MachineModuleUrlService,
        private modalService: AppModalService
    ) { }

    getAll(machinePlanId: number): Observable<MachinePlanItem[]> {
        const url = `${this.urlService.machinePlanUrl}/${machinePlanId}/${this.urlService.machinePlanItemUrl}`;
        return this.http
            .get(url, { headers: appHeaders })
            .catch(err => this.modalService.openHttpErrorWindow(err));
    }

    save(machinePlanId: number, planItem: MachinePlanItem): Observable<MachinePlanItem> {
        const url = `${this.urlService.machinePlanUrl}/${machinePlanId}/${this.urlService.machinePlanItemUrl}`;
        return this.http
            .post(url, planItem, { headers: appHeaders })
            .catch(err => this.modalService.openHttpErrorWindow(err));
    }

    update(planItem: MachinePlanItem): Observable<MachinePlanItem> {
        const url = `${this.urlService.machinePlanItemFullUrl}/${planItem.id}`;
        return this.http
            .put(url, planItem, { headers: appHeaders })
            .catch(err => this.modalService.openHttpErrorWindow(err));
    }

    delete(id: number) {
        const url = `${this.urlService.machinePlanItemFullUrl}/${id}`;
        return this.http
            .delete(url, { headers: appHeaders })
            .catch(err => this.modalService.openHttpErrorWindow(err));
    }

}

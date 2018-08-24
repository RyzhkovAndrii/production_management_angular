import { Injectable } from '@angular/core';
import { Observable } from '../../../../../node_modules/rxjs';
import { HttpClient } from '@angular/common/http';

import appHeaders from '../../../app-utils/app-headers';
import { MachineModuleUrlService } from './machine-module-url.service';
import { MachinePlanItem } from '../models/machine-plan-item.model';
import { AppHttpErrorService } from '../../app-shared/services/app-http-error.service';

@Injectable()
export class MachinePlanItemService {

    constructor(
        private http: HttpClient,
        private urlService: MachineModuleUrlService,
        private httpErrorService: AppHttpErrorService
    ) { }

    getAll(machinePlanId: number): Observable<MachinePlanItem[]> {
        const url = `${this.urlService.machinePlanUrl}/${machinePlanId}/${this.urlService.machinePlanItemUrl}`;
        return this.http
            .get(url, { headers: appHeaders })
            .catch(err => this.httpErrorService.openHttpErrorWindow(err));
    }

    save(machinePlanId: number, planItem: MachinePlanItem): Observable<MachinePlanItem> {
        const url = `${this.urlService.machinePlanUrl}/${machinePlanId}/${this.urlService.machinePlanItemUrl}`;
        return this.http
            .post(url, planItem, { headers: appHeaders })
            .catch(err => this.httpErrorService.openHttpErrorWindow(err));
    }

}

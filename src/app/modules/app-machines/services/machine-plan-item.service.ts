import { Injectable } from "@angular/core";
import { Observable } from "../../../../../node_modules/rxjs";
import { HttpClient } from "@angular/common/http";

import { MachineModuleUrlService } from "./machine-module-url.service";
import { httpErrorHandle } from "../../../app-utils/app-http-error-handler";
import { MachinePlanItem } from "../models/machine-plan-item.model";
import appHeaders from "../../../app-utils/app-headers";

@Injectable()
export class MachinePlanItemService {

    constructor(
        private http: HttpClient,
        private urlService: MachineModuleUrlService
    ) { }

    getAll(machinePlanId: number): Observable<MachinePlanItem[]> {
        const url = `${this.urlService.machinePlanUrl}/${machinePlanId}/${this.urlService.machinePlanItemUrl}`;
        return this.http
            .get(url, { headers: appHeaders })
            .catch(httpErrorHandle);
    }

}

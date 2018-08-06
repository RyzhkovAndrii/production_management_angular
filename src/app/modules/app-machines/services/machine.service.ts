import { Injectable } from "@angular/core";
import { Observable } from "../../../../../node_modules/rxjs";
import { MachinePlanItem } from "../models/machine-plan-item.model";
import { HttpParams, HttpClient } from "@angular/common/http";
import { MachineModuleUrlService } from "./machine-module-url.service";
import appHeaders from "../../../app-utils/app-headers";
import { httpErrorHandle } from "../../../app-utils/app-http-error-handler";
import { formatDate } from "../../../app-utils/app-date-utils";

@Injectable()
export class MachineService {

    constructor(
        private http: HttpClient,
        private urlService: MachineModuleUrlService
    ) { }

    getAll(date: Date, machineNumber: number) {
        let params = new HttpParams()
            .set('sort', 'timeStart')
            .set('machine_number', machineNumber.toString())
            .set('date', formatDate(date));
        return this.http
            .get(this.urlService.machineUrl, { params, headers: appHeaders })
            .catch(httpErrorHandle);
    }

    save(planItem: MachinePlanItem): Observable<MachinePlanItem> {
        return this.http
            .post(this.urlService.machineUrl, planItem, { headers: appHeaders })
            .catch(httpErrorHandle);
    }

}

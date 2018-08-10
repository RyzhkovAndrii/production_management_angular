import { Injectable } from "@angular/core";
import { Observable } from "../../../../../node_modules/rxjs";
import { MachinePlan } from "../models/machine-plan.model";
import { HttpParams, HttpClient } from "@angular/common/http";
import { MachineModuleUrlService } from "./machine-module-url.service";
import appHeaders from "../../../app-utils/app-headers";
import { httpErrorHandle } from "../../../app-utils/app-http-error-handler";
import { formatDate } from "../../../app-utils/app-date-utils";

@Injectable()
export class MachinePlanService {

    constructor(
        private http: HttpClient,
        private urlService: MachineModuleUrlService
    ) { }

    getAll(date: Date, machineNumber: number): Observable<MachinePlan[]> {
        let params = new HttpParams()
            .set('sort', 'timeStart')
            .set('machine_number', machineNumber.toString())
            .set('date', formatDate(date));
        return this.http
            .get(this.urlService.machinePlanUrl, { params, headers: appHeaders })
            .catch(httpErrorHandle);
    }

    save(plan: MachinePlan): Observable<MachinePlan> {
        return this.http
            .post(this.urlService.machinePlanUrl, plan, { headers: appHeaders })
            .catch(httpErrorHandle);
    }

    delete(id: number) {
        const url = `${this.urlService.machinePlanUrl}/${id}`;
        return this.http.delete(url, { headers: appHeaders }).catch(httpErrorHandle);
      }

}

import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "../../../../../node_modules/rxjs";

import { UserModuleUrlService } from "./user-module-url.serivce";
import { TableType } from "../models/table-type.enum";
import { Modififcation } from "../models/modification.model";
import { httpErrorHandle } from "../../../app-utils/app-http-error-handler";

@Injectable()
export class ModificationService {

    constructor(
        private http: HttpClient,
        private urlService: UserModuleUrlService
    ) { }

    get(tableType: TableType): Observable<Modififcation> {
        const params = new HttpParams().set('table_type', tableType);
        return this.http.get(this.urlService.lastModificationUrl, {params}).catch(httpErrorHandle);
    }

}

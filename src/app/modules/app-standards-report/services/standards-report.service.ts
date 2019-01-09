import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { formatDate } from '../../../app-utils/app-date-utils';
import appHeaders from '../../../app-utils/app-headers';
import { AppModalService } from '../../app-shared/services/app-modal.service';
import { StandardsReportModuleUrlService } from './standards-report-module-url.service';
import { StandardReport } from '../models/standard-report.model';

@Injectable()
export class StandardsReportService {

    constructor(
        private http: HttpClient,
        private urlService: StandardsReportModuleUrlService,
        private modalService: AppModalService
    ) { }

    getAll(from: Date, to: Date): Observable<StandardReport[]> {
        const params = new HttpParams()
            .set('from', formatDate(from))
            .set('to', formatDate(to));
        return this.http
            .get(this.urlService.standardsReportUrl, { params, headers: appHeaders })
            .catch(err => this.modalService.openHttpError(err));
    }

}

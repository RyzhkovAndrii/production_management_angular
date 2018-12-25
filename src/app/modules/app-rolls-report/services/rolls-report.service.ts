import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { RollsReportModuleUrlService } from './rolls-report-module-url.service';
import { formatDate } from '../../../app-utils/app-date-utils';
import appHeaders from '../../../app-utils/app-headers';
import { AppModalService } from '../../app-shared/services/app-modal.service';
import { RollReport } from '../models/roll-report.model';

@Injectable()
export class RollsReportService {

    constructor(
        private http: HttpClient,
        private urlService: RollsReportModuleUrlService,
        private modalService: AppModalService
    ) { }

    getAll(from: Date, to: Date): Observable<RollReport[]> {
        const params = new HttpParams()
            .set('from', formatDate(from))
            .set('to', formatDate(to));
        return this.http
            .get(this.urlService.rollsReportUrl, { params, headers: appHeaders })
            .catch(err => this.modalService.openHttpError(err));
    }

}

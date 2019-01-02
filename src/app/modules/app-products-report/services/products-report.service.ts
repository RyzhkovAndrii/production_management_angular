import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import appHeaders from '../../../app-utils/app-headers';
import { formatDate } from '../../../app-utils/app-date-utils';
import { AppModalService } from '../../app-shared/services/app-modal.service';
import { ProductsReportModuleUrlService } from './products-report-module-url.service';
import { ProductReport } from '../models/product-report.model';

@Injectable()
export class ProductsReportService {

    constructor(
        private http: HttpClient,
        private urlService: ProductsReportModuleUrlService,
        private modalService: AppModalService
    ) { }

    getAll(from: Date, to: Date): Observable<ProductReport[]> {
        const params = new HttpParams()
            .set('from', formatDate(from))
            .set('to', formatDate(to));
        return this.http
            .get(this.urlService.ProductsReportUrl, { params, headers: appHeaders })
            .catch(err => this.modalService.openHttpError(err));
    }

}

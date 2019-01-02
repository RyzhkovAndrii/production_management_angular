import { Injectable } from '@angular/core';

import { RestDetailsService } from '../../../services/rest-details-service';

@Injectable()
export class ProductsReportModuleUrlService {

    private host = this.restDetails.host;

    ProductsReportUrl = `${this.host}/product-reports`;

    constructor(private restDetails: RestDetailsService) { }

}

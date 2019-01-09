import { Injectable } from '@angular/core';

import { RestDetailsService } from '../../../services/rest-details-service';

@Injectable()
export class StandardsReportModuleUrlService {

    private host = this.restDetails.host;

    standardsReportUrl = `${this.host}/norm-reports`;

    constructor(private restDetails: RestDetailsService) { }

}

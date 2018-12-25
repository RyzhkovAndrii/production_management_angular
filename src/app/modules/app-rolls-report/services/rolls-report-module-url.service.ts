import { Injectable } from '@angular/core';

import { RestDetailsService } from '../../../services/rest-details-service';

@Injectable()
export class RollsReportModuleUrlService {

    private host = this.restDetails.host;

    rollsReportUrl = `${this.host}/roll-reports`;

    constructor(private restDetails: RestDetailsService) { }

}

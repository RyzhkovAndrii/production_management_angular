import { Injectable } from '@angular/core';
import { RestDetailsService } from '../../../services/rest-details-service';

@Injectable()
export class MachineModuleUrlService {

    private host = this.restDetails.host;

    machinePlanUrl = `${this.host}/machine-plans`;
    machinePlanItemFullUrl = `${this.host}/machine-plan-items`;
    machinePlanItemUrl = 'machine-plan-items';

    constructor(private restDetails: RestDetailsService) { }

}

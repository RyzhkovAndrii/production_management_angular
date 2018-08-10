import { Injectable } from "@angular/core";
import { RestDetailsService } from "../../../services/rest-details-service";

@Injectable()
export class MachineModuleUrlService {

    private host = this.restDetails.host;

    machinePlanUrl = `${this.host}/machine-plan`; // todo 'machine-planS'
    machinePlanItemFullUrl = `${this.host}/machine-plan-item`; 
    machinePlanItemUrl = 'machine-plan-item'; 

    constructor(private restDetails: RestDetailsService) { }

}

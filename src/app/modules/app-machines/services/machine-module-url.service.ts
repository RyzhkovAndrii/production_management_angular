import { Injectable } from "@angular/core";
import { RestDetailsService } from "../../../services/rest-details-service";

@Injectable()
export class MachineModuleUrlService {

    private host = this.restDetails.host;

    machineUrl = `${this.host}/machine-plan`; // todo 'machine-planS'

    constructor(private restDetails: RestDetailsService) { }

}

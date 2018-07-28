import { Injectable } from "@angular/core";

import { RestDetailsService } from "../../../services/rest-details-service";

@Injectable()
export class SharedModuleUrlService {

    private host = this.restDetails.host;

    lastModificationUrl = `${this.host}/modifications`;

    constructor(private restDetails: RestDetailsService) { }

}

import { Injectable } from "@angular/core";

import { RestDetailsService } from "../../../services/rest-details-service";

@Injectable()
export class UserModuleUrlService {

    private host = this.restDetails.host;

    userUrl = `${this.host}/users`;
    lastModificationUrl = `${this.host}/modifications`;

    constructor(private restDetails: RestDetailsService) { }

}

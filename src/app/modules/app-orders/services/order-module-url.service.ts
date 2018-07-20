import { Injectable } from "@angular/core";
import { RestDetailsService } from "../../../services/rest-details-service";

@Injectable()
export class OrderModuleUrlService {

    private host = this.restDetails.host;

    orderUrl = `${this.host}/orders`;
    clientUrl = `${this.host}/clients`;
    orderItemUrl = `${this.host}/order-items`;
    simpleOrderItemUrl = `/order-items`

    constructor(private restDetails: RestDetailsService) { }

}

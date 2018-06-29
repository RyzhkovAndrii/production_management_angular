import {
  Injectable
} from "@angular/core";
import {
  RestDetailsService
} from "../../../services/rest-details-service";

@Injectable()
export class ProductsPlanUrlsService {
  constructor(private restDetails: RestDetailsService) {}
  batchesUrl = `${this.restDetails.host}/product-plan-batches`;
  operationsUrl = `${this.restDetails.host}/product-plan-operations`;
}

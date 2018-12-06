import {
  Injectable
} from '@angular/core';
import {
  RestDetailsService
} from '../../../services/rest-details-service';

@Injectable()
export class RollsPlanUrlsService {

  constructor(private restDetails: RestDetailsService) {}

  batchesUrl = `${this.restDetails.host}/roll-plan-batches`;
  operationsUrl = `${this.restDetails.host}/roll-plan-operations`;
  leftoverUrls = `${this.restDetails.host}/roll-plan-leftover`;
}

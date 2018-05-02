import {
  Injectable
} from '@angular/core';
import {
  RestDetailsService
} from '../../../services/rest-details-service';

@Injectable()
export class RollsUrlService {
  private host = this.restDetails.host;

  rollTypesUrl = `${this.host}/roll-types`;
  rollBatchUrl = `${this.host}/roll-batches`;
  rollLeftoverUrl = `${this.host}/roll-leftovers`;
  rollOperationUrl = `${this.host}/roll-operations`;
  rollChecksUrl = `${this.host}/roll-checks`;

  constructor(private restDetails: RestDetailsService) {}
}

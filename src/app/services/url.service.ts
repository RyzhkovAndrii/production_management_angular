import { Injectable } from '@angular/core';

const host = 'http://localhost:8080';

@Injectable()
export class UrlService {
  rollTypesUrl = `${host}/roll-types`;
  rollBatchUrl = `${host}/roll-batches`;
  rollLeftoverUrl = `${host}/roll-leftovers`;
  rollOperationUrl = `${host}/roll-operations`;
}

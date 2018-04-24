import { Injectable } from '@angular/core';

@Injectable()
export class UrlService {
  rollTypesUrl = 'http://localhost:8080/roll-types';
  rollBatchUrl = 'http://localhost:8080/roll-batches';
  rollLeftoverUrl = 'http://localhost:8080/roll-leftovers';
  rollOperationUrl = 'http://localhost:8080/roll-operations';
}

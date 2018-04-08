import { Injectable } from '@angular/core';

@Injectable()
export class UrlService {
  rollTypesUrl = 'http://localhost:3000/rollType';
  rollBatchUrl = 'http://localhost:3000/roll-batch';
  rollLeftoverUrl = 'http://localhost:3000/roll-leftover';
}

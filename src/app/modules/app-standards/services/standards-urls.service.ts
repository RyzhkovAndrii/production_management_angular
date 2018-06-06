import { Injectable } from '@angular/core';
import { RestDetailsService } from '../../../services/rest-details-service';

@Injectable()
export class StandardsUrlsService {
  constructor(private restDetails: RestDetailsService) { }
  private host = this.restDetails.host;
  standardsUrl = `${this.host}/norms`;
}

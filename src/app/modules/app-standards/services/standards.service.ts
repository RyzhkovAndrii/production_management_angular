import {
  Injectable
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';

import {
  StandardsUrlsService
} from './standards-urls.service';
import {
  httpErrorHandle
} from '../../../app-utils/app-http-error-handler';
import {
  Observable
} from 'rxjs/Observable';
import {
  ProductsService
} from '../../app-products/services/products.service';
import {
  RollsService
} from '../../app-rolls/services/rolls.service';

@Injectable()
export class StandardsService {

  constructor(
    private urls: StandardsUrlsService,
    private http: HttpClient,
    private productsService: ProductsService,
    private rollsService: RollsService
  ) {}

  getStandardsInfo(): Observable < StandardsInfo > {
    return this.getStandards()
      .map(standards => new Map(standards.map(x => [x.productTypeId, x] as [number, StandardResponse])))
      .flatMap(standardsMap => this.productsService.getProductTypes()
        .flatMap(productsMap => this.rollsService.getRollTypes()
          .map(rolls => new Map(rolls.map(x => [x.id, x] as[number, RollType])))
          .map(rollsMap => {
            const standardsInfo: StandardsInfo = {
              standardResponses: standardsMap,
              productTypes: productsMap,
              rollTypes: rollsMap
            }
            return standardsInfo;
          })));
  }

  getStandards(): Observable < StandardResponse[] > {
    return this.http.get(this.urls.standardsUrl).catch(httpErrorHandle);
  }

  getStandard(standardId: number): Observable < StandardResponse > {
    return this.http.get(`${this.urls.standardsUrl}/${standardId}`).catch(httpErrorHandle);
  }

  postStandard(standard: StandardRequest): Observable < StandardResponse > {
    return this.http.post(this.urls.standardsUrl, standard).catch(httpErrorHandle);
  }

  putStandard(standardId: number, standard: StandardRequest): Observable < StandardResponse > {
    return this.http.put(`${this.urls}/${standardId}`, standard).catch(httpErrorHandle);
  }

  deleteStandard(standardId: number): Observable < any > {
    return this.http.delete(`${this.urls.standardsUrl}/${standardId}`).catch(httpErrorHandle);
  }
}

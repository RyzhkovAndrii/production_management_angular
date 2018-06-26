import {
  Injectable
} from '@angular/core';
import {
  HttpClient, HttpParams
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
import {
  from
} from 'rxjs/observable/from';
import appHeaders from '../../../app-utils/app-headers';

@Injectable()
export class StandardsService {

  constructor(
    private urls: StandardsUrlsService,
    private http: HttpClient,
    private productsService: ProductsService,
    private rollsService: RollsService
  ) {}

  getStandardsInfo(): Observable < StandardInfo[] > {
    return this.getStandards()
      .map(standards => new Map(standards.map(x => [x.productTypeId, x] as[number, Standard])))
      .flatMap(standardsMap => this.productsService.getProductTypes()
        .flatMap(products => this.rollsService.getRollTypes()
          .map(rolls => new Map(rolls.map(x => [x.id, x] as[number, RollType])))
          .flatMap(rollsMap => from(products)
            .map(product => {
              const standard = standardsMap.get(product.id) || < Standard > {};
              const rollTypes = standard.rollTypeIds ? standard.rollTypeIds.map(x => rollsMap.get(x)) : [ < RollType > {}];
              const info: StandardInfo = {
                productType: product,
                rollTypes,
                standardResponse: standard
              };
              return info;
            })
          )
        )
      ).toArray();
  }

  getStandards(): Observable < Standard[] > {
    return this.http.get(this.urls.standardsUrl, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  getStandardsByRollId(rollTypeId: number): Observable < Standard[] > {
    return this.http.get(this.urls.standardsUrl, {
      headers: appHeaders,
      params: new HttpParams().set('rollTypeId', String(rollTypeId))
    }).catch(httpErrorHandle);
  }

  getStandard(standardId: number): Observable < Standard > {
    return this.http.get(`${this.urls.standardsUrl}/${standardId}`, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  postStandard(standard: Standard): Observable < Standard > {
    return this.http.post(this.urls.standardsUrl, standard, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  putStandard(standardId: number, standard: Standard): Observable < Standard > {
    return this.http.put(`${this.urls.standardsUrl}/${standardId}`, standard, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  deleteStandard(standardId: number): Observable < any > {
    return this.http.delete(`${this.urls.standardsUrl}/${standardId}`, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }
}
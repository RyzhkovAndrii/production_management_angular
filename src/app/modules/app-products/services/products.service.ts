import {
  Injectable
} from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import {
  Observable
} from 'rxjs/Observable';
import {
  from
} from 'rxjs/observable/from';
import { of
} from 'rxjs/observable/of';

import {
  ProductsUrlsService
} from './products-urls.service';
import {
  httpErrorHandle
} from '../../../app-utils/app-http-error-handler';
import {
  formatDate
} from '../../../app-utils/app-date-utils';
import {
  compareProductTypes
} from '../../../app-utils/app-comparators';
import appHeaders from '../../../app-utils/app-headers';

@Injectable()
export class ProductsService {

  constructor(private urls: ProductsUrlsService, private http: HttpClient) {}

  getProductsInfo(daylyDate: Date, fromDate: Date, toDate: Date): Observable < ProductInfo[][] > {
    return this.getProductsLeftovers(fromDate)
      .map(restOvers => new Map(restOvers.map(x => [x.productTypeId, x] as[number, ProductLeftoverResponse])))
      .flatMap(restOversMap => this.getDaylyBatches(daylyDate)
        .map(dayBatches => new Map(dayBatches.map(x => [x.productTypeId, x] as[number, ProductBatchResponse])))
        .flatMap(dayBatchesMap => this.getMonthlyBatches(fromDate, toDate)
          .map(monthBatches => new Map(monthBatches.map(x => [x.productTypeId, x] as[number, ProductBatchResponse])))
          .flatMap(monthBatchesMap => this.getProductsLeftovers(toDate)
            .map(currentOvers => new Map(currentOvers.map(x => [x.productTypeId, x] as[number, ProductLeftoverResponse])))
            .flatMap(currentOversMap => this.getProductsChecks()
              .map(checks => new Map(checks.map(x => [x.productTypeId, x] as[number, ProductCheckResponse])))
              .flatMap(checksMap => this.getProductTypes()
                .flatMap(types => from(types)
                  .map(type => {
                    const info: ProductInfo = {
                      type,
                      restLeftover: restOversMap.get(type.id) || < ProductLeftoverResponse > {},
                      dayBatch: dayBatchesMap.get(type.id) || < ProductBatchResponse > {},
                      monthBatch: monthBatchesMap.get(type.id) || < ProductBatchResponse > {},
                      currentLeftover: currentOversMap.get(type.id) || < ProductLeftoverResponse > {},
                      productCheck: checksMap.get(type.id) || < ProductCheckResponse > {}
                    }
                    return info;
                  })
                ).reduce((acc, value, index) => {
                  if (acc.has(value.type.colorCode.toLowerCase())) acc.get(value.type.colorCode.toLocaleLowerCase()).push(value);
                  else acc.set(value.type.colorCode.toLocaleLowerCase(), [value]);
                  return acc;
                }, new Map < string, ProductInfo[] > ())
                .flatMap(infoMap => Array.from(infoMap.values())))
            )
          )
        )
      ).toArray();
  }

  getProductTypes(): Observable < ProductTypeResponse[] > {
    return this.http.get(this.urls.productTypesUrl, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  getSortedProductTypes(): Observable< ProductTypeResponse[] > {
    return this.getProductTypes()
      .map(data => data.sort(compareProductTypes))
      .catch(httpErrorHandle);
  }

  getLastProductsLeftOvers(): Observable< ProductLeftoverResponse[] > {
    const url = `${this.urls.productLeftoverUrl}?latest`
    return this.http.get(url).catch(httpErrorHandle);
  }

  getProductsLeftovers(date: Date): Observable < ProductLeftoverResponse[] > {
    const params = new HttpParams()
      .set('date', formatDate(date));
    return this.http.get(this.urls.productLeftoverUrl, {
      params,
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  getProductLeftover(productTypeId: number, date: Date): Observable < ProductLeftoverResponse > {
    const params = new HttpParams()
      .set('product-type-id', String(productTypeId))
      .set('date', formatDate(date));
    return this.http.get(this.urls.productLeftoverUrl, {
      params,
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  getDaylyBatches(date: Date): Observable < ProductBatchResponse[] > {
    const params = new HttpParams()
      .set('date', formatDate(date));
    return this.http.get(this.urls.productBatchUrl, {
      params,
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  getDaylyBatch(productTypeId: number, date: Date): Observable < ProductBatchResponse > {
    const params = new HttpParams()
      .set('product-type-id', String(productTypeId))
      .set('date', formatDate(date));
    return this.http.get(this.urls.productBatchUrl, {
      params,
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  getMonthlyBatches(fromDate: Date, toDate: Date): Observable < ProductBatchResponse[] > {
    const params = new HttpParams()
      .set('from', formatDate(fromDate))
      .set('to', formatDate(toDate));
    return this.http.get(this.urls.productBatchUrl, {
      params,
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  getMonthlyBatch(productTypeId: number, fromDate: Date, toDate: Date): Observable < ProductBatchResponse > {
    const params = new HttpParams()
      .set('product-type-id', String(productTypeId))
      .set('from', formatDate(fromDate))
      .set('to', formatDate(toDate));
    return this.http.get(this.urls.productBatchUrl, {
      params,
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  getProductsChecks(): Observable < ProductCheckResponse[] > {
    return this.http.get(this.urls.productChecksUrl, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  getProductCheck(productTypeId: number): Observable < ProductCheckResponse > {
    const params = new HttpParams()
      .set('product_type_id', String(productTypeId));
    return this.http.get(this.urls.productChecksUrl, {
      params,
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  getProductTypesByName(name: string): Observable < ProductTypeResponse[] > {
    const params = new HttpParams()
      .set('name', name);
    return this.http.get(this.urls.productTypesUrl, {
      params,
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  postProductType(type: ProductTypeRequest): Observable < ProductTypeResponse > {
    return this.http.post(this.urls.productTypesUrl, type, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  postProductOperation(operation: ProductOperationRequest): Observable < ProductOperationResponse > {
    return this.http.post(this.urls.productOperationUrl, operation, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  putProductType(id: number, type: ProductTypeRequest): Observable < ProductTypeResponse > {
    const url = `${this.urls.productTypesUrl}/${id}`;
    return this.http.put(url, type, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  putProductChecks(productChecks: ProductCheckResponse[]): Observable < ProductCheckResponse[] > {
    return from(productChecks).flatMap(value => this.putProductCheck(value)).toArray();
  }

  putProductCheck(check: ProductCheckResponse): Observable < ProductCheckResponse > {
    const url = `${this.urls.productChecksUrl}/${check.id}`;
    const body: ProductCheckRequest = {
      productLeftOverCheckStatus: check.productLeftOverCheckStatus
    };
    return this.http.put(url, body, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  deleteProductType(id: number) {
    const url = `${this.urls.productTypesUrl}/${id}`;
    return this.http.delete(url, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }
}

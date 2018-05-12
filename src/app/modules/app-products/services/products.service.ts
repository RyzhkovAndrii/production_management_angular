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
  ProductsUrlsService
} from './products-urls.service';
import {
  httpErrorHandle
} from '../../../app-utils/app-http-error-handler';
import {
  formatDate
} from '../../../app-utils/app-date-utils';

@Injectable()
export class ProductsService {

  constructor(private urls: ProductsUrlsService, private http: HttpClient) {}

  getProductTypes(): Observable < ProductTypeResponse[] > {
    return this.http.get(this.urls.productTypesUrl).catch(httpErrorHandle);
  }

  getProductLeftover(productTypeId: number, date: Date): Observable < ProductLeftoverResponse > {
    const params = new HttpParams()
      .set('product-type-id', String(productTypeId))
      .set('date', formatDate(date));
    return this.http.get(this.urls.productLeftoverUrl, {
      params
    }).catch(httpErrorHandle);
  }

  getDaylyBatch(productTypeId: number, date: Date): Observable < ProductBatchResponse > {
    const params = new HttpParams()
      .set('product-type-id', String(productTypeId))
      .set('date', formatDate(date));
    return this.http.get(this.urls.productBatchUrl, {
      params
    }).catch(httpErrorHandle);
  }

  getMonthlyBatch(productTypeId: number, fromDate: Date, toDate: Date): Observable < ProductBatchResponse > {
    const params = new HttpParams()
      .set('product-type-id', String(productTypeId))
      .set('from', formatDate(fromDate))
      .set('to', formatDate(toDate));
    return this.http.get(this.urls.productBatchUrl, {
      params
    }).catch(httpErrorHandle);
  }

  getProductCheck(productTypeId: number): Observable < ProductCheckResponse > {
    const params = new HttpParams()
      .set('product_type_id', String(productTypeId));
    return this.http.get(this.urls.productChecksUrl, {
      params
    }).catch(httpErrorHandle);
  }

  postProductType(type: ProductTypeRequest): Observable < ProductTypeResponse > {
    return this.http.post(this.urls.productTypesUrl, type).catch(httpErrorHandle);
  }

  postProductOperation(operation: ProductOperationRequest): Observable < ProductOperationResponse > {
    return this.http.post(this.urls.productOperationUrl, operation).catch(httpErrorHandle);
  }

  putProductType(id: number, type: ProductTypeRequest): Observable < ProductTypeResponse > {
    const url = `${this.urls.productTypesUrl}/${id}`;
    return this.http.put(url, type).catch(httpErrorHandle);
  }

  putProductCheck(id: number, check: ProductCheckRequest) {
    const url = `${this.urls.productChecksUrl}/${id}`;
    return this.http.put(url, check).catch(httpErrorHandle);
  }

  deleteProductType(id: number) {
    const url = `${this.urls.productTypesUrl}/${id}`;
    return this.http.delete(url).catch(httpErrorHandle);
  }
}

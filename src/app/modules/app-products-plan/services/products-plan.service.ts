import {
  Injectable
} from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import {
  Observable
} from 'rxjs';
import {
  ProductsPlanUrlsService
} from './products-plan-urls.service';
import {
  ProductsService
} from '../../app-products/services/products.service';
import appHeaders from '../../../app-utils/app-headers';
import {
  httpErrorHandle
} from '../../../app-utils/app-http-error-handler';

@Injectable()
export class ProductsPlanService {

  constructor(private urls: ProductsPlanUrlsService,
    private http: HttpClient,
    private productsService: ProductsService) {}

  getBatch(id: number, date: string): Observable < ProductPlanBatchResponse > {
    const params = new HttpParams()
      .set('id', String(id))
      .set('date', date);
    return this.http.get(this.urls.batchesUrl, {
      headers: appHeaders,
      params
    }).catch(httpErrorHandle);
  }

  getBatches(date: string): Observable < ProductPlanBatchResponse[] > {
    const params = new HttpParams()
      .set('date', date);
    return this.http.get(this.urls.batchesUrl, {
      headers: appHeaders,
      params
    }).catch(httpErrorHandle);
  }

  getOperationsByProduct(productTypeId: number, fromDate: string, toDate: string): Observable < ProductPlanOperationResponse[] > {
    const params = new HttpParams()
      .set('id', String(productTypeId))
      .set('from', fromDate)
      .set('to', toDate);
    return this.http.get(this.urls.operationsUrl, {
      headers: appHeaders,
      params
    }).catch(httpErrorHandle);
  }

  getOperationsByRoll(rollTypeId: number, fromDate: string, toDate: string): Observable < ProductPlanOperationResponse[] > {
    const params = new HttpParams()
      .set('roll_id', String(rollTypeId))
      .set('from', fromDate)
      .set('to', toDate);
    return this.http.get(this.urls.operationsUrl, {
      headers: appHeaders,
      params
    }).catch(httpErrorHandle);
  }

  getAllOperations(): Observable < ProductPlanOperationResponse[] > {
    return this.http.get(this.urls.operationsUrl, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  getOperation(operationId: number): Observable < ProductPlanOperationResponse > {
    const url = `${this.urls.operationsUrl}/${operationId}`;
    return this.http.get(url, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  getProductPlanLeftoverWithoutPlan(productTypeId: number, fromDate: string, toDate: string): Observable < ProductLeftoverResponse > {
    const params = new HttpParams()
      .set('id', String(productTypeId))
      .set('from', fromDate)
      .set('to', toDate);
    return this.http.get(this.urls.leftoverUrl, {
      headers: appHeaders,
      params
    }).catch(httpErrorHandle);
  }

  getProductPlanLeftoverTotal(productTypeId: number, fromDate: string, toDate: string): Observable < ProductLeftoverResponse > {
    const params = new HttpParams()
      .set('id', String(productTypeId))
      .set('from_date', fromDate)
      .set('to_date', toDate);
    return this.http.get(this.urls.leftoverUrl, {
      headers: appHeaders,
      params
    }).catch(httpErrorHandle);
  }

  getAllProductPlanLeftoversWithoutPlan(fromDate: string, toDate: string): Observable < ProductLeftoverResponse[] > {
    const params = new HttpParams()
      .set('from', fromDate)
      .set('to', toDate);
    return this.http.get(this.urls.leftoverUrl, {
      headers: appHeaders,
      params
    }).catch(httpErrorHandle);
  }

  getAllProductPlanLeftoversTotal(fromDate: string, toDate: string): Observable < ProductLeftoverResponse[] > {
    const params = new HttpParams()
      .set('from_date', fromDate)
      .set('to_date', toDate);
    return this.http.get(this.urls.leftoverUrl, {
      headers: appHeaders,
      params
    }).catch(httpErrorHandle);
  }

  postOperation(operation: ProductPlanOperationRequest): Observable < ProductPlanOperationResponse > {
    return this.http.post(this.urls.operationsUrl, operation, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  putOperation(operationId: number, operation: ProductPlanOperationRequest): Observable < ProductPlanOperationResponse > {
    const url = `${this.urls.operationsUrl}/${operationId}`;
    return this.http.put(url, operation, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  deleteOperation(operationId: number): Observable < any > {
    const url = `${this.urls.operationsUrl}/${operationId}`;
    return this.http.delete(url, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }
}

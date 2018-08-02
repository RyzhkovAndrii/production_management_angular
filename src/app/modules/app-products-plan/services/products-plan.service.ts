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
  from
} from 'rxjs/observable/from';

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
import {
  addDays,
  formatDate,
  midnightDate
} from '../../../app-utils/app-date-utils';

@Injectable()
export class ProductsPlanService {

  constructor(private urls: ProductsPlanUrlsService,
    private http: HttpClient,
    private productsService: ProductsService) {}

  getProductPlanInfo(fromDate: Date, toDate: Date): Observable < ProductPlanInfo[] > {
    const weeklyDate = formatDate(addDays(fromDate, 7));
    const beginDate = formatDate(fromDate);
    const endDate = formatDate(toDate);
    const currentDate = formatDate(midnightDate());

    return this.productsService.getProductTypes()
      .flatMap(products => this.getBatchesByRange(beginDate, endDate)
        .flatMap(batches => this.getAllProductPlanLeftoversWithoutPlan(currentDate).map(this.convertOversToMap)
          .flatMap(currentOversMap => this.getAllProductPlanLeftoversWithoutPlan(weeklyDate).map(this.convertOversToMap)
            .flatMap(weeklyOversMap => this.getAllProductPlanLeftoversTotal(weeklyDate).map(this.convertOversToMap)
              .flatMap(weeklyTotalOversMap => from(products)
                .map(product => {
                  const info: ProductPlanInfo = {
                    productType: product,
                    currentProductLeftover: currentOversMap.get(product.id),
                    planBatches: batches[product.id],
                    weeklyLeftoverWithoutPlans: weeklyOversMap.get(product.id),
                    weeklyLeftoverTotal: weeklyTotalOversMap.get(product.id)
                  }
                  return info;
                })
                .toArray())))));
  }

  private convertOversToMap(overs: ProductLeftoverResponse[]): Map < number, ProductLeftoverResponse > {
    return new Map(overs.map(x => [x.productTypeId, x] as[number, ProductLeftoverResponse]));
  }

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

  getBatchesByRange(fromDate: string, toDate: string): Observable < Map < number, ProductBatchResponse[] > > {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate);
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

  getAllProductPlanLeftoversWithoutPlan(date: string): Observable < ProductLeftoverResponse[] > {
    const params = new HttpParams()
      .set('date', date);
    return this.http.get(this.urls.leftoverUrl, {
      headers: appHeaders,
      params
    }).catch(httpErrorHandle);
  }

  getAllProductPlanLeftoversTotal(toDate: string): Observable < ProductLeftoverResponse[] > {
    const params = new HttpParams()
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

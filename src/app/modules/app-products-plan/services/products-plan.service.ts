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

  
}

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
  RollsPlanUrlsService
} from './rolls-plan-urls.service';
import {
  RollsService
} from '../../app-rolls/services/rolls.service';
import appHeaders from '../../../app-utils/app-headers';
import {
  httpErrorHandle
} from '../../../app-utils/app-http-error-handler';

@Injectable()
export class RollsPlanService {

  constructor(private urls: RollsPlanUrlsService,
    private http: HttpClient,
    private rollsService: RollsService) {}

  getBatchesByRange(fromDate: string, toDate: string): Observable < Map < number, RollPlanBatchResponse[] >> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate);
    return this.http.get(this.urls.batchesUrl, {
      headers: appHeaders,
      params
    }).catch(httpErrorHandle);
  }

  getRollPlanLeftoversWithoutPlan(date: string): Observable < RollLeftover[] > {
    const params = new HttpParams()
      .set('date', date);
    return this.http.get(this.urls.leftoverUrls, {
      headers: appHeaders,
      params: params
    }).catch(httpErrorHandle);
  }

  getRollPlanLeftoversTotal(toDate: string): Observable < RollLeftover > {
    const params = new HttpParams()
      .set('to_date', toDate);
    return this.http.get(this.urls.leftoverUrls, {
      headers: appHeaders,
      params: params
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

  postOperation(operation: RollPlanOperationRequest): Observable < RollPlanOperationResponse > {
    return this.http.post(this.urls.operationsUrl, operation, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  putOperation(operationId: number, operation: RollPlanOperationRequest): Observable < RollPlanOperationResponse > {
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

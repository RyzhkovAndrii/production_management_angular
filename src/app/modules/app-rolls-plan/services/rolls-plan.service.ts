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
import {
  formatDate,
  addDays,
  midnightDate
} from '../../../app-utils/app-date-utils';
import {
  from
} from 'rxjs/observable/from';

@Injectable()
export class RollsPlanService {

  constructor(private urls: RollsPlanUrlsService,
    private http: HttpClient,
    private rollsService: RollsService) {}

  getRollPlansInfo(fromDate: Date, toDate: Date): Observable < RollPlanInfo[] > {
    const weeklyDate = formatDate(addDays(fromDate, 7));
    const beginDate = formatDate(fromDate);
    const endDate = formatDate(toDate);
    const currentDate = formatDate(midnightDate());

    return this.rollsService.getRollTypes()
      .flatMap(rolls => this.getBatchesByRange(beginDate, endDate)
        .flatMap(batches => this.getRollPlanLeftoversWithoutPlan(currentDate).map(this.convertOversToMap)
          .flatMap(currentOversMap => this.getRollPlanLeftoversWithoutPlan(weeklyDate).map(this.convertOversToMap)
            .flatMap(weeklyOversMap => this.getRollPlanLeftoversTotal(weeklyDate).map(this.convertOversToMap)
              .flatMap(weeklyTotalOversMap => this.getRollPlanLeftoversWithoutPlan(endDate).map(this.convertOversToMap)
                .flatMap(toOversMap => this.getRollPlanLeftoversTotal(endDate).map(this.convertOversToMap)
                  .flatMap(toTotalOversMap => from(rolls)
                    .map(roll => {
                      const info: RollPlanInfo = {
                        rollType: roll,
                        currentRollLeftover: currentOversMap[roll.id],
                        planBatches: batches[roll.id],
                        weeklyLeftoverWithoutPlans: weeklyOversMap[roll.id],
                        weeklyLeftoverTotal: weeklyTotalOversMap[roll.id],
                        inTwoWeeksLeftoverWithoutPlans: toOversMap[roll.id],
                        inTwoWeeksLeftoverTotal: toTotalOversMap[roll.id]
                      }
                      return info;
                    })
                    .toArray()
                  )
                )
              )
            )
          )
        )
      );
  }

  private convertOversToMap(overs: RollLeftover[]): Map < number, RollLeftover > {
    return new Map(overs.map(x => [x.rollTypeId, x] as[number, RollLeftover]));
  }

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

  getRollPlanLeftoversTotal(toDate: string): Observable < RollLeftover[] > {
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

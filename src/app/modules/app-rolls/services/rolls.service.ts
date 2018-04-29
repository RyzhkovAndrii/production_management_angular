import {
  Injectable
} from '@angular/core';
import {
  RollsUrlService
} from './rolls-url.service';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import {
  flatMap
} from 'rxjs/operators';
import {
  from
} from 'rxjs/observable/from';
import { of
} from 'rxjs/observable/of';
import {
  Observable
} from 'rxjs/Observable';
import {
  formatDate
} from '../../../app-utils/app-date-utils';
import {
  httpErrorHandle
} from '../../../app-utils/app-http-error-handler';

@Injectable()
export class RollsService {

  headers = new HttpHeaders();

  constructor(private urls: RollsUrlService, private http: HttpClient) {}

  postRollOperation(rollOperation: RollOperation) {
    return this.http.post(this.urls.rollOperationUrl, rollOperation).catch(httpErrorHandle);
  }

  putRollType(rollType: RollType): Observable < RollType > {
    const requestUrl = `${this.urls.rollTypesUrl}/${String(rollType.id)}`;
    const dto: RollTypeDTO = {
      note: rollType.note,
      colorCode: rollType.colorCode,
      thickness: rollType.thickness,
      weight: rollType.weight
    }
    return <Observable < RollType >> this.http.put(requestUrl, dto).catch(httpErrorHandle);
  }

  getRollsInfo(restDate: Date, fromDate: Date, totalDate: Date): Observable < RollInfo[] > {
    return this.http.get(this.urls.rollTypesUrl, {
      headers: this.headers
    }).flatMap(
      (data: RollType[]) => from(data)
      .flatMap((type: RollType) => this.getRollBatchesByDateRange(type.id, fromDate, totalDate)
        .flatMap((batches: RollBatch[]) => this.getRollLeftoverByRollIdAndDate(type.id, restDate)
          .flatMap((restOver: RollLeftover) => this.getRollLeftoverByRollIdAndDate(type.id, totalDate)
            .flatMap((totalOver: RollLeftover) => {
              const rollInfo: RollInfo = {
                rollType: type,
                rollBatches: batches,
                restRollLeftover: restOver,
                totalRollLeftover: totalOver,
              };
              return of(rollInfo);
            })
          )
        )
      )
    ).toArray().catch(httpErrorHandle);
  }

  postRollType(rollType: RollTypeDTO, daysInTable: number, restDate: Date, toDate: Date): Observable < RollInfo > {
    return this.http.post(this.urls.rollTypesUrl, rollType, {
      headers: this.headers
    }).map((createdRollType: RollType) => {
      return {
        rollType: createdRollType,
        rollBatches: new Array(daysInTable),
        restRollLeftover: {
          date: formatDate(restDate),
          rollTypeId: createdRollType.id,
          amount: 0
        },
        totalRollLeftover: {
          date: formatDate(toDate),
          rollTypeId: createdRollType.id,
          amount: 0
        }
      }
    }).catch(httpErrorHandle);
  }

  getRollBatchesByDateRange(rollTypeId: number, from: Date, to: Date) {
    const params = new HttpParams({
      fromObject: {
        roll_type_id: String(rollTypeId),
        from: formatDate(from),
        to: formatDate(to)
      }
    });
    return this.http.get(this.urls.rollBatchUrl, {
      params,
      headers: this.headers
    }).catch(httpErrorHandle);
  }

  getRollLeftoverByRollIdAndDate(rollTypeId: number, date: Date) {
    const params = new HttpParams({
      fromObject: {
        roll_type_id: String(rollTypeId),
        date: formatDate(date)
      }
    });
    return this.http.get(this.urls.rollLeftoverUrl, {
      params,
      headers: this.headers
    }).catch(httpErrorHandle);
  }
}

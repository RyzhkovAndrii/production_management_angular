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
import {
  CheckStatus
} from '../enums/check-status.enum';

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
      minWeight: rollType.minWeight,
      maxWeight: rollType.maxWeight
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
            .flatMap((totalOver: RollLeftover) => this.getRollCheck(type.id)
              .flatMap((rollCheck: RollCheck) => {
                const rollInfo: RollInfo = {
                  rollType: type,
                  rollBatches: batches,
                  restRollLeftover: restOver,
                  totalRollLeftover: totalOver,
                  rollCheck
                };
                return of(rollInfo);
              })
            )
          )
        )
      )
    ).toArray().catch(httpErrorHandle);
  }

  getRollsInfoWithoutCheck(restDate: Date, fromDate: Date, totalDate: Date): Observable < RollInfo[] > {
    return this.http.get(this.urls.rollTypesUrl, {
      headers: this.headers
    }).flatMap(
      (data: RollType[]) => from(data)
      .flatMap((type: RollType) => this.getRollBatchesByDateRange(type.id, fromDate, totalDate)
        .flatMap((batches: RollBatch[]) => this.getRollLeftoverByRollIdAndDate(type.id, restDate)
          .flatMap((restOver: RollLeftover) => this.getRollLeftoverByRollIdAndDate(type.id, totalDate)
            .flatMap((totalOver: RollLeftover) => of ( < RollCheck > {
                id: undefined,
                rollTypeId: undefined,
                rollLeftOverCheckStatus: CheckStatus.NOT_CHECKED
              })
              .flatMap((rollCheck: RollCheck) => {
                const rollInfo: RollInfo = {
                  rollType: type,
                  rollBatches: batches,
                  restRollLeftover: restOver,
                  totalRollLeftover: totalOver,
                  rollCheck
                };
                return of(rollInfo);
              })
            )
          )
        )
      )
    ).toArray().catch(httpErrorHandle);
  }

  postRollType(rollType: RollTypeDTO, daysInTable: number, restDate: Date, toDate: Date): Observable < RollInfo > {
    return this.http.post(this.urls.rollTypesUrl, rollType, {
      headers: this.headers
    }).map((createdRollType: RollType) => {
      const info: RollInfo = {
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
        },
        rollCheck: {
          id: createdRollType.id,
          rollTypeId: createdRollType.id,
          rollLeftOverCheckStatus: CheckStatus.NOT_CHECKED
        }
      };
      return info
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

  getRollCheck(rollTypeId: number) {
    const params = new HttpParams()
      .append('roll_type_id', String(rollTypeId));
    return this.http.get(this.urls.rollChecksUrl, {
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

  putRollChecks(rollChecks: RollCheck[]): Observable < RollCheck[] > {
    return from(rollChecks).flatMap((value) => this.putRollChek(value)).toArray();
  }

  putRollChek(rollCheck: RollCheck): Observable < RollCheck > {
    const url = `${this.urls.rollChecksUrl}/${rollCheck.id}`;
    const body: RollCheckRequest = {
      rollLeftOverCheckStatus: rollCheck.rollLeftOverCheckStatus
    };
    return this.http.put(url, body).catch(httpErrorHandle);
  }

  getRollOperations(rollTypeId: number, from: string, to: string) {
    const params = new HttpParams()
      .set('roll_type_id', String(rollTypeId))
      .set('from_manuf', from)
      .set('to_manuf', to);
    return this.http.get(this.urls.rollOperationUrl, {
      params,
      headers: this.headers
    }).catch(httpErrorHandle);
  }

  deleteRollType(rollTypeId: number) {
    const url = `${this.urls.rollTypesUrl}/${rollTypeId}`;
    return this.http.delete(url)
      .catch(httpErrorHandle);
  }
}

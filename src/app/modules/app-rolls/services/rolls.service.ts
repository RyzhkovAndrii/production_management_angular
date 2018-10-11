import {
  Injectable
} from '@angular/core';
import {
  RollsUrlService
} from './rolls-url.service';
import {
  HttpClient,
  HttpParams
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
} from '../../app-shared/enums/check-status.enum';
import appHeaders from '../../../app-utils/app-headers';

@Injectable()
export class RollsService {

  constructor(private urls: RollsUrlService, private http: HttpClient) {}

  postRollOperation(rollOperation: RollOperation) {
    return this.http.post(this.urls.rollOperationUrl, rollOperation, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  putRollType(rollType: RollType): Observable < RollType > {
    const requestUrl = `${this.urls.rollTypesUrl}/${String(rollType.id)}`;
    const dto: RollTypeDTO = {
      note: rollType.note,
      colorCode: rollType.colorCode,
      thickness: rollType.thickness,
      minWeight: rollType.minWeight,
      maxWeight: rollType.maxWeight,
      length: rollType.length
    }
    return <Observable < RollType >> this.http.put(requestUrl, dto, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  getRollsInfo(restDate: Date, fromDate: Date, totalDate: Date): Observable < RollInfo[] > {
    return this.getRollTypes()
      .flatMap(
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
      ).toArray();
  }

  getRollsInfoWithoutCheck(restDate: Date, fromDate: Date, totalDate: Date): Observable < RollInfo[] > {
    return this.getRollTypes()
      .flatMap(
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
      ).toArray();
  }

  getRollType(id: number): Observable < RollType > {
    return this.http.get(`${this.urls.rollTypesUrl}/${id}`, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  getRollTypes(): Observable < RollType[] > {
    return this.http.get(this.urls.rollTypesUrl, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  getRollsByColor(colorCode: string): Observable < RollType[] > {
    const params = new HttpParams()
      .set('color', colorCode);
    return this.http.get(this.urls.rollTypesUrl, {
      params,
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  getTotalLeftover(date: Date): Observable < number > {
    const params = new HttpParams()
      .set('date', formatDate(date))
      .set('total', undefined);
    return this.http.get(this.urls.rollLeftoverUrl, {
        params,
        headers: appHeaders
      })
      .map((value: RollTotalLeftOverResponse) => value.total)
      .catch(httpErrorHandle);
  }

  postRollType(rollType: RollTypeDTO, daysInTable: number, restDate: Date, toDate: Date): Observable < RollInfo > {
    return this.http.post(this.urls.rollTypesUrl, rollType, {
      headers: appHeaders
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
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  getRollBatch(rollTypeId: number, date: string): Observable < RollBatch > {
    const params = new HttpParams()
      .set('roll_type_id', String(rollTypeId))
      .set('date', date);
    return this.http.get(this.urls.rollBatchUrl, {
      params,
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  getRollCheck(rollTypeId: number) {
    const params = new HttpParams()
      .append('roll_type_id', String(rollTypeId));
    return this.http.get(this.urls.rollChecksUrl, {
      params,
      headers: appHeaders
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
      headers: appHeaders
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
    return this.http.put(url, body, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  putOperation(operationId: number, operation: RollOperation) {
    const url = `${this.urls.rollOperationUrl}/${operationId}`;
    return this.http.put(url, operation, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  getRollOperations(rollTypeId: number, from: string, to: string) {
    const params = new HttpParams()
      .set('roll_type_id', String(rollTypeId))
      .set('from_manuf', from)
      .set('to_manuf', to);
    return this.http.get(this.urls.rollOperationUrl, {
      params,
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  deleteRollType(rollTypeId: number) {
    const url = `${this.urls.rollTypesUrl}/${rollTypeId}`;
    return this.http.delete(url, {
      headers: appHeaders
    }).catch(httpErrorHandle);
  }

  deleteRollOperation(operationId: number) {
    const url = `${this.urls.rollOperationUrl}/${operationId}`;
    return this.http.delete(url, {
        headers: appHeaders
      })
      .catch(httpErrorHandle);
  }
}

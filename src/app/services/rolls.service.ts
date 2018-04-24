import {
  Injectable
} from '@angular/core';
import {
  UrlService
} from './url.service';
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpErrorResponse
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
} from '../app-utils/app-date-utils.module';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class RollsService {

  headers = new HttpHeaders();

  postRollOperation(rollOperation: RollOperation) {
    console.log(rollOperation);
    return this.http.post(this.urls.rollOperationUrl, rollOperation);    
  }

  putRollType(rollType: RollType): Observable<RollType> {
    const requestUrl = `${this.urls.rollTypesUrl}/${String(rollType.id)}`;
    const dto: RollTypeDTO = {
      name: rollType.name,
      colorCode: rollType.colorCode,
      thickness: rollType.thickness,
      weight: rollType.weight
    }
    return <Observable<RollType>>this.http.put(requestUrl, dto);
  }
  constructor(private urls: UrlService, private http: HttpClient) {}

  getRollsInfo(restDate: Date, fromDate: Date, totalDate: Date): Observable < RollInfo[] > {
    return this.http.get(this.urls.rollTypesUrl, {headers: this.headers}).flatMap(
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
    ).toArray();
  }

  postRollType(rollType: RollTypeDTO, daysInTable: number, restDate: Date, toDate: Date): Observable < RollInfo > {
    return this.http.post(this.urls.rollTypesUrl, rollType, {headers: this.headers}).map((createdRollType: RollType) => {
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
    });
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
    }).catch(this.handleError);
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
    });
  }
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(
      'Something bad happened; please try again later.');
  };
}

import {
  Injectable
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';

import {
  StandardsUrlsService
} from './standards-urls.service';
import {
  httpErrorHandle
} from '../../../app-utils/app-http-error-handler';
import {
  Observable
} from 'rxjs/Observable';

@Injectable()
export class StandardsService {

  constructor(private urls: StandardsUrlsService, private http: HttpClient) {}

  getStandards(): Observable < StandardResponse[] > {
    return this.http.get(this.urls.standardsUrl).catch(httpErrorHandle);
  }

  getStandard(standardId: number): Observable < StandardResponse > {
    return this.http.get(`${this.urls.standardsUrl}/${standardId}`).catch(httpErrorHandle);
  }

  postStandard(standard: StandardRequest): Observable < StandardResponse > {
    return this.http.post(this.urls.standardsUrl, standard).catch(httpErrorHandle);
  }

  putStandard(standardId: number, standard: StandardRequest): Observable < StandardResponse > {
    return this.http.put(`${this.urls}/${standardId}`, standard).catch(httpErrorHandle);
  }

  deleteStandard(standardId: number): Observable < any > {
    return this.http.delete(`${this.urls.standardsUrl}/${standardId}`).catch(httpErrorHandle);
  }
}

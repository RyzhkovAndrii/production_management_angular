import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { httpErrorHandle } from '../../../app-utils/app-http-error-handler';
import { OrderModuleUrlService } from './order-module-url.service';

@Injectable()
export class ClientsService {

  constructor(private http: HttpClient,
    private urlService: OrderModuleUrlService) { }

  getAll() {
    return this.http.get(this.urlService.clientUrl).catch(httpErrorHandle);
  }

  getClient(id: number): Observable<ClientResponse> {
    const url = `${this.urlService.clientUrl}/${id}`;
    return this.http.get(url).catch(httpErrorHandle);
  }

}

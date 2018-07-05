import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { OrderModuleUrlService } from './order-module-url.service';
import { httpErrorHandle } from '../../../app-utils/app-http-error-handler';
import { Client } from '../models/client.model';

@Injectable()
export class ClientsService {

  constructor(private http: HttpClient,
    private urlService: OrderModuleUrlService) { }

  getAll() {
    const params = new HttpParams().set('sort', 'name');
    return this.http.get(this.urlService.clientUrl, { params }).catch(httpErrorHandle);
  }

  getClient(id: number): Observable<Client> {
    const url = `${this.urlService.clientUrl}/${id}`;
    return this.http.get(url).catch(httpErrorHandle);
  }

  save(client: Client): Observable<Client> {
    return this.http.post(this.urlService.clientUrl, client).catch(httpErrorHandle);
  }

  update(client: Client, id: number): Observable<Client> {
    const url = `${this.urlService.clientUrl}/${id}`;
    return this.http.put(url, client).catch(httpErrorHandle);
  }

  delete(id: number) {
    const url = `${this.urlService.clientUrl}/${id}`;
    return this.http.delete(url).catch(httpErrorHandle);
  }

}

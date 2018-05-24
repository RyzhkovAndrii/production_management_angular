import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { httpErrorHandle } from '../../../app-utils/app-http-error-handler';

@Injectable()
export class ClientsService {

  constructor(private http: HttpClient) { }

  getClientResponse(clientId: number): Observable<ClientResponse> {
    const clientsUrl = 'http://localhost:3004/clients/' + clientId;
    return this.http.get(clientsUrl).catch(httpErrorHandle);
  }

}
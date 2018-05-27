import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { httpErrorHandle } from '../../../app-utils/app-http-error-handler';
import { ClientsService } from './client.service';
import { OrderItemService } from './order-item.service';
import { OrderModuleUrlService } from './order-module-url.service';

@Injectable()
export class OrdersService {

  constructor(private http: HttpClient,
    private clietnsService: ClientsService,
    private orderItemService: OrderItemService,
    private urlService: OrderModuleUrlService) { }

  getOrderList(): Observable<OrderResponse[]> {
    return this.http.get(this.urlService.orderUrl).catch(httpErrorHandle);;
  }

}

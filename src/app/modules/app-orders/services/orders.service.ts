import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { OrderModuleUrlService } from './order-module-url.service';
import { httpErrorHandle } from '../../../app-utils/app-http-error-handler';
import { Order } from '../models/order.model';
import { formatDate, formatDateServerToBrowser } from '../../../app-utils/app-date-utils';

@Injectable()
export class OrdersService {

  constructor(private http: HttpClient,
    private urlService: OrderModuleUrlService) { }

  getOrderList(): Observable<Order[]> {
    const params = new HttpParams()
      .set('_sort', 'deliveryDate')
      .set('isDelivered', 'false');
    // params.append('_sort', 'deliveryDate'); // todo sort parameter in REST
    // params.append('isDelivered', 'false');
    return this.http.get(this.urlService.orderUrl, { params }).catch(httpErrorHandle);
  }

  getOrderListWithDelivered(startDate: Date): Observable<Order[]> {
    console.log(formatDateServerToBrowser(formatDate(startDate)));
    const obsFirst$ = this.getOrderList();
    const params = new HttpParams()
      .set('_sort', 'deliveryDate') // todo sort parameter in REST
      .set('isDelivered', 'true') // todo in REST
      // .set('showDeliveredStartDate', formatDateBrowserToServer(formatDate(startDate))); // todo in REST
      .set('actualDeliveryDate_gte', formatDateServerToBrowser(formatDate(startDate)));
    const obsSecond$ = this.http.get(this.urlService.orderUrl, { params }).catch(httpErrorHandle);
    return Observable
      .forkJoin(obsFirst$, obsSecond$)
      .map(([data1, data2]) => [...data1, ...data2])
      .map(data => data.sort(this._compareFn))
      .catch(httpErrorHandle);
  }

  private _compareFn(first: Order, second: Order): number {
    if (first.deliveryDate > second.deliveryDate) return 1;
    if (first.deliveryDate < second.deliveryDate) return -1;
    return 0;
  }

  save(order: Order): Observable<Order> {
    return this.http.post(this.urlService.orderUrl, order).catch(httpErrorHandle);
  }

  update(order: Order, id: number): Observable<Order> {
    const url = `${this.urlService.orderUrl}/${id}`;
    return this.http.put(url, order).catch(httpErrorHandle);
  }

  delete(id: number): Observable<Order> {
    const url = `${this.urlService.orderUrl}/${id}`;
    return this.http.delete(url).catch(httpErrorHandle);
  }

}

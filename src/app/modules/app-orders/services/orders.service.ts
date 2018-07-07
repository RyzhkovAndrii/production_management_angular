import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { OrderModuleUrlService } from './order-module-url.service';
import { httpErrorHandle } from '../../../app-utils/app-http-error-handler';
import { Order } from '../models/order.model';
import { formatDate, formatDateServerToBrowser, formatDateBrowserToServer } from '../../../app-utils/app-date-utils';
import appHeaders from '../../../app-utils/app-headers';

@Injectable()
export class OrdersService {

  constructor(
    private http: HttpClient,
    private urlService: OrderModuleUrlService
  ) { }

  getOrderList(): Observable<Order[]> {
    const params = new HttpParams()
      .set('sort', 'deliveryDate')
      .set('isDelivered', 'false');
    return this.http
      .get(this.urlService.orderUrl, { params, headers: appHeaders })
      .map((data: Order[]) => data.map(order => this.formatDatesFromServer(order)))
      .catch(httpErrorHandle);
  }

  getOrderListWithDelivered(startDate: Date): Observable<Order[]> {
    const obsFirst$ = this.getOrderList();
    const params = new HttpParams()
      .set('sort', 'deliveryDate')
      .set('isDelivered', 'true')
      .set('from', formatDate(startDate));
    const obsSecond$ = this.http.get(this.urlService.orderUrl, { params })
      .map((data: Order[]) => data.map(order => this.formatDatesFromServer(order)))
      .catch(httpErrorHandle);
    return Observable
      .forkJoin(obsFirst$, obsSecond$)
      .map(([data1, data2]) => [...data1, ...data2])
      .map(data => data.sort(this._compareFn));
  }

  save(order: Order): Observable<Order> {
    return this.http
      .post(this.urlService.orderUrl, this.formatDatesToServer(order), { headers: appHeaders })
      .catch(httpErrorHandle);
  }

  update(order: Order, id: number): Observable<Order> {
    const url = `${this.urlService.orderUrl}/${id}`;
    return this.http.put(url, this.formatDatesToServer(order), { headers: appHeaders }).catch(httpErrorHandle);
  }

  delete(id: number): Observable<Order> {
    const url = `${this.urlService.orderUrl}/${id}`;
    return this.http.delete(url, { headers: appHeaders }).catch(httpErrorHandle);
  }

  private formatDatesFromServer(order: Order) { // todo on server side
    let convertedOrder = order;
    convertedOrder.deliveryDate = formatDateServerToBrowser(order.deliveryDate);
    convertedOrder.actualDeliveryDate = order.actualDeliveryDate === null
      ? null
      : formatDateServerToBrowser(order.actualDeliveryDate);
    convertedOrder.creationDate = formatDateServerToBrowser(order.creationDate);
    return convertedOrder;
  }

  private _compareFn(first: Order, second: Order): number {
    if (first.deliveryDate > second.deliveryDate) return 1;
    if (first.deliveryDate < second.deliveryDate) return -1;
    return 0;
  }

  private formatDatesToServer(order: Order) { // todo on server side
    let convertedOrder = order;
    convertedOrder.deliveryDate = formatDateBrowserToServer(order.deliveryDate);
    convertedOrder.actualDeliveryDate = order.actualDeliveryDate === null
      ? null
      : formatDateBrowserToServer(order.actualDeliveryDate);
    return convertedOrder;
  }

}

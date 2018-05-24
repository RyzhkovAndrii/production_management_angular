import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { httpErrorHandle } from '../../../app-utils/app-http-error-handler';
import { ClientsService } from './client.service';
import { from } from 'rxjs/observable/from';

@Injectable()
export class OrdersService {

  constructor(private http: HttpClient, private clietnsService: ClientsService) { }

  ordersUrl = 'http://localhost:3004/orders/';

  getOrderResponseList(): Observable<OrderResponse[]> {
    return this.http.get(this.ordersUrl).catch(httpErrorHandle);
  }

  getOrderDetailsList(): Observable<OrderDetails[]> {
    return this.getOrderResponseList()
      .map((response: OrderResponse[]) => this.convertArray(response))
      .catch(httpErrorHandle);
  }

  convert(response: OrderResponse): OrderDetails {
    var orderDetails = {} as OrderDetails;
    orderDetails.id = response.id;
    orderDetails.city = response.city;
    orderDetails.creationDate = response.creationDate;
    orderDetails.deliveryDate = response.deliveryDate;
    orderDetails.isImportant = response.isImportant;
    orderDetails.isDelivered = response.isDelivered;
    orderDetails.isOverdue = response.isOverdue;
    this.clietnsService.getClientResponse(response.clientId)
      .subscribe((client: ClientResponse) => {orderDetails.client = client});
    return orderDetails;
  }

  convertArray(response: OrderResponse[]): OrderDetails[] {
    return response.map((item) => this.convert(item));
  }

}

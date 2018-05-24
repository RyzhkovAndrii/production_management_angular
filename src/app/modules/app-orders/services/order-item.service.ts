import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { PARAMETERS } from "@angular/core/src/util/decorators";
import { httpErrorHandle } from "../../../app-utils/app-http-error-handler";

@Injectable()
export class OrderItemService {

    constructor(private http: HttpClient) { }

    getOrderItemResponseList(orderId: number): Observable<OrderItemResponse[]> {
        const orderItemUrl = 'http://localhost:3004/order-items/';
        const params = new HttpParams().set('orderId', String(orderId));
        return this.http.get(orderItemUrl, {params}).catch(httpErrorHandle);
    }

}
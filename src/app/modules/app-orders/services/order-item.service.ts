import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

import { OrderModuleUrlService } from "./order-module-url.service";
import { httpErrorHandle } from "../../../app-utils/app-http-error-handler";
import { OrderItem } from "../models/order-item.model";

@Injectable()
export class OrderItemService {

    constructor(private http: HttpClient,
        private urlService: OrderModuleUrlService) { }

    getOrderItemList(orderId: number): Observable<OrderItem[]> {
        const params = new HttpParams().set('orderId', String(orderId));
        return this.http.get(this.urlService.orderItemUrl, { params }).catch(httpErrorHandle);
    }

    saveOrderItem(orderItem: OrderItem) {
        return this.http.post(this.urlService.orderItemUrl, orderItem).catch(httpErrorHandle);
    }

    saveOrderItemList(orderItemList: OrderItem[]) { // todo REST for this method
        return this.http.post(this.urlService.orderItemUrl, orderItemList).catch(httpErrorHandle);
    }

}

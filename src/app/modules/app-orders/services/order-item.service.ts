import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

import { OrderModuleUrlService } from "./order-module-url.service";
import { httpErrorHandle } from "../../../app-utils/app-http-error-handler";
import { OrderItem } from "../models/order-item.model";
import appHeaders from "../../../app-utils/app-headers";

@Injectable()
export class OrderItemService {

    constructor(private http: HttpClient,
        private urlService: OrderModuleUrlService) { }

    getOrderItemList(orderId: number): Observable<OrderItem[]> {
        const url = `${this.urlService.orderUrl}/${orderId}/${this.urlService.simpleOrderItemUrl}`;
        return this.http.get(url, { headers: appHeaders }).catch(httpErrorHandle);
    }

    saveOrderItem(orderItem: OrderItem) {
        return this.http.post(this.urlService.orderItemUrl, orderItem, { headers: appHeaders }).catch(httpErrorHandle);
    }

    updateOrderItem(orderItem: OrderItem, id: number) {
        const url = `${this.urlService.orderItemUrl}/${id}`;
        return this.http.put(url, orderItem, { headers: appHeaders }).catch(httpErrorHandle);    
    }

    saveOrderItemList(orderItemList: OrderItem[]) {
        if (orderItemList.length !== 0) {
            const obs = (orderItemList.map(orderItem => this.saveOrderItem(orderItem)));
            return Observable.forkJoin(obs).catch(httpErrorHandle);
        } else {
            return Observable.of(null);
        }
    }

    updateOrderItemList(orderItemList: OrderItem[]) { 
        if (orderItemList.length !== 0) {
            const obs = (orderItemList.map(orderItem => this.updateOrderItem(orderItem, orderItem.id)));
            return Observable.forkJoin(obs).catch(httpErrorHandle);
        } else {
            return Observable.of(null);
        }
    }

    removeById(id: number) {
        const url = `${this.urlService.orderItemUrl}/${id}`;
        return this.http.delete(url, { headers: appHeaders }).catch(httpErrorHandle);
    }

    removeListByIds(idList: number[]) {
        if (idList.length !== 0) {
            const obs = (idList.map(id => this.removeById(id)));
            const obs1 = Observable.forkJoin(obs).catch(httpErrorHandle);
            return obs1;
        } else {
            return Observable.of(null);
        }
    }

}

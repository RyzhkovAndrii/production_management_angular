import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

import { OrderModuleUrlService } from "./order-module-url.service";
import { httpErrorHandle } from "../../../app-utils/app-http-error-handler";
import { OrderItem } from "../models/order-item.model";
import { EmptyObservable } from "rxjs/observable/EmptyObservable";

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
        if (orderItemList.length !== 0) {
            const obs = (orderItemList.map(order => this.saveOrderItem(order)));
            return Observable.forkJoin(obs).catch(httpErrorHandle);
            // return this.http.post(this.urlService.orderItemUrl, orderItemList).catch(httpErrorHandle);
        } else {
            return Observable.of(null);
        }
    }

    removeById(id: number) {
        const url = `${this.urlService.orderItemUrl}/${id}`;
        console.log(url);
        return this.http.delete(url).catch(httpErrorHandle);
    }

    removeListByIds(idList: number[]) {
        if (idList.length !== 0) {
            const obs = (idList.map(id => this.removeById(id)));
            console.log(obs);
            const obs1 = Observable.forkJoin(obs).catch(httpErrorHandle);
            console.log(obs1);
            return obs1;
        } else {
            return Observable.of(null);
        }
    }

}

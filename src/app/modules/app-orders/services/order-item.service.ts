import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { PARAMETERS } from "@angular/core/src/util/decorators";
import { httpErrorHandle } from "../../../app-utils/app-http-error-handler";
import { BehaviorSubject } from "rxjs";
import { OrderModuleUrlService } from "./order-module-url.service";

@Injectable()
export class OrderItemService {

    constructor(private http: HttpClient,
        private urlService: OrderModuleUrlService) { }

    getOrderItemList(orderId: number): Observable<OrderItemResponse[]> {
        const params = new HttpParams().set('orderId', String(orderId));
        return this.http.get(this.urlService.orderItemUrl, { params }).catch(httpErrorHandle);
    }

}

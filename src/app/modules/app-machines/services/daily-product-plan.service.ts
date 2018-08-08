import { Injectable } from "@angular/core";
import { ProductsService } from "../../app-products/services/products.service";
import { Observable } from "../../../../../node_modules/rxjs";

@Injectable()
export class DailyProductPlanService {

    private productTypeCash: ProductTypeResponse[] = [];

    constructor(
        private productService: ProductsService
    ) { }

    getProductType(id: number): Observable<ProductTypeResponse> {
        const cash = this.productTypeCash.find(productType => productType.id == id);
        return cash
            ? Observable.of(cash)
            : this.productService
                .getProductType(id)
                .do(response => this.productTypeCash.push(response));
    }

}
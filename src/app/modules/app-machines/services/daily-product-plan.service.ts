import { Injectable } from "@angular/core";
import { ProductsService } from "../../app-products/services/products.service";
import { Observable } from "../../../../../node_modules/rxjs";
import { RollsService } from "../../app-rolls/services/rolls.service";

@Injectable()
export class DailyProductPlanService {

    private productTypeCash: ProductTypeResponse[] = [];
    private rollTypeCash: RollType[] = [];

    constructor(
        private productService: ProductsService,
        private rollService: RollsService
    ) { }

    getProductType(id: number): Observable<ProductTypeResponse> {
        const cash = this.productTypeCash.find(productType => productType.id == id);
        return cash
            ? Observable.of(cash)
            : this.productService
                .getProductType(id)
                .do(response => this.productTypeCash.push(response));
    }

    getRollType(id: number): Observable<RollType> {
        const cash = this.rollTypeCash.find(rollType => rollType.id == id);
        return cash
            ? Observable.of(cash)
            : this.rollService
                .getRollType(id)
                .do(response => this.rollTypeCash.push(response));
    }

}
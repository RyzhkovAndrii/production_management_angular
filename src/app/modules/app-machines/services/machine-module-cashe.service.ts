import { Injectable } from "@angular/core";
import { ProductsService } from "../../app-products/services/products.service";
import { Observable } from "../../../../../node_modules/rxjs";
import { RollsService } from "../../app-rolls/services/rolls.service";

@Injectable()
export class MachineModuleCasheService {

    private productTypeCashe: ProductTypeResponse[] = [];
    private rollTypeCashe: RollType[] = [];

    constructor(
        private productService: ProductsService,
        private rollService: RollsService
    ) { }

    getProductType(id: number): Observable<ProductTypeResponse> {
        const cash = this.productTypeCashe.find(productType => productType.id == id);
        return cash
            ? Observable.of(cash)
            : this.productService
                .getProductType(id)
                .do(response => this.productTypeCashe.push(response));
    }

    getRollType(id: number): Observable<RollType> {
        const cash = this.rollTypeCashe.find(rollType => rollType.id == id);
        return cash
            ? Observable.of(cash)
            : this.rollService
                .getRollType(id)
                .do(response => this.rollTypeCashe.push(response));
    }

}
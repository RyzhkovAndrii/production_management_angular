interface ProductPlanOperationModalData {
    productType: ProductTypeResponse;
    batch?: ProductPlanBatchResponse;
    date: string;
    stadard: StandardWithRolls;
    func (result: Promise<ProductPlanOperationRequest>): void;
}
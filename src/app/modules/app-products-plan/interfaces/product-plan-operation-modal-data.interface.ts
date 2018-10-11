interface ProductPlanOperationModalData {
    productType: ProductTypeResponse;
    batch?: ProductPlanBatchResponse;
    operation?: ProductPlanOperationWithRoll;
    date: string;
    standard: StandardWithRolls;
    func (result: Promise<ProductPlanOperationRequest>): void;
}
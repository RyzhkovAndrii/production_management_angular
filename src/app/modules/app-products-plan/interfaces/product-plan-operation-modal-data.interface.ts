interface ProductPlanOperationModalData {
    productType: ProductTypeResponse;
    batch?: ProductPlanBatchResponse;
    date: string;
    standard: StandardWithRolls;
    func (result: Promise<ProductPlanOperationRequest>): void;
}
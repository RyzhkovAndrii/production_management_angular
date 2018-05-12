interface ProductInfo {
    type: ProductTypeResponse;
    restLeftover: ProductLeftoverResponse;
    dayManufacturedBatch: ProductBatchResponse;
    monthManufacturedBatch: ProductBatchResponse;
    daySoldBatch: ProductBatchResponse;
    monthSoldBatch: ProductBatchResponse;
    currentLeftover: ProductLeftoverResponse;
    productCheck: ProductCheckResponse;
}
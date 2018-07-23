interface ProductPlanInfo {
    productType: ProductTypeResponse;
    currentProductLeftover: ProductLeftoverResponse;
    planBatches: ProductBatchResponse[];
    weeklyLeftoverWithoutPlans: ProductLeftoverResponse;
    weeklyLeftoverTotal: ProductLeftoverResponse;
    inTwoWeeksLeftoverWithoutPlans: ProductLeftoverResponse;
    inTwoWeeksLeftoverTotal: ProductLeftoverResponse;
}
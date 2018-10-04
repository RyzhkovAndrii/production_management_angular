interface ProductPlanOperationSelectModalData {
    operations: ProductPlanOperationWithRoll[];
    action(p: Promise < ProductPlanOperationWithRoll >);
}
interface OperationSelectModalData {
    operations: ProductPlanOperationResponse[];
    action(operation: ProductPlanOperationResponse);
}
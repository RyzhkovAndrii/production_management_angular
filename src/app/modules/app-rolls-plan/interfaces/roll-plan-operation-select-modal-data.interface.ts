interface RollPlanOperationSelectModalData {
    operations: RollPlanOperationResponse[];
    action(result: Promise<RollPlanOperationResponse>)
}
interface RollPlanOperationModalData {
    batch: RollPlanBatchResponse;
    operation?: RollPlanOperationResponse;
    func(result: Promise<RollPlanOperationRequest>);
}
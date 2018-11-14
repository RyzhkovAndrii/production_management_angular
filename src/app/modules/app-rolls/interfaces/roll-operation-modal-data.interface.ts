interface RollOperationModalData {
  batch: RollBatch;
  operation?: RollOperationResponse;
  rollTypeId: number;
  manufacturedDate: Date;
  func(result: Promise < RollOperationRequest > );
}

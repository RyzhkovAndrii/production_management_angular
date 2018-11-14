interface RollOperationModalData {
  batch: RollBatch;
  operation?: RollOperationResponse;
  rollTypeId: number;
  manufacturedDate: Date;
  productsByRollInNorms: ProductTypeResponse[];
  func(result: Promise < RollOperationRequest > );
}

interface RollOperationModalData {
  batch: RollBatch;
  operation?: RollOperationResponseWithProduct;
  rollTypeId: number;
  manufacturedDate: Date;
  productsByRollInNorms: ProductTypeResponse[];
  func(result: Promise < RollOperationRequest > );
}

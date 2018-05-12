interface RollOperationModalData {
  batch: RollBatch;
  rollTypeId: number;
  manufacturedDate: Date;
  operation(result: Promise < RollOperation > );
}

interface RollBatch {
    id: number;
    dateManufactured: string;
    rollTypeId: number;
    manufacturedAmount: number;
    usedAmount: number;
    leftAmount: number;
}
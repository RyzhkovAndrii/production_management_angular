interface RollBatch {
    dateManufactured: string;
    rollTypeId: number;
    manufacturedAmount: number;
    usedAmount: number;
    leftOverAmount: number;
    readyToUse: boolean;
}
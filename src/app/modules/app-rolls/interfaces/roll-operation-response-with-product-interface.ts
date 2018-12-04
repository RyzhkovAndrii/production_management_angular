interface RollOperationResponseWithProduct {
    id: number;
    operationDate: string;
    operationType: string;
    manufacturedDate: string;
    rollTypeId: number;
    rollAmount: number;
    productType: ProductTypeResponse;
}
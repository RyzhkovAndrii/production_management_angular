export class StandardReport {

    public productTypeId: number;
    public productPlanAmount: number;
    public productActualAmount: number;
    public rolls: {
        rollTypeId: number,
        amount: number
    }[];

    constructor() { }

}

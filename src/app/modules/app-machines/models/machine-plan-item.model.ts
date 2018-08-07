export class MachinePlanItem {

    public machineNumber: number;
    public timeStart: string;
    public productTypeId: number;
    public productAmount: number;
    public isImportant: boolean;
    public id?: number;
    public duration?: number;
    public productType?: ProductTypeResponse;

    constructor() { }

}

import { MachinePlanItem } from './machine-plan-item.model';

export class MachinePlan {

    public machineNumber: number;
    public timeStart: string;
    public productTypeId: number;
    public productAmount: number;
    public isImportant: boolean;
    public planItems?: MachinePlanItem[];
    public id?: number;
    public duration?: number;
    public productType?: ProductTypeResponse;

    constructor() { }

}

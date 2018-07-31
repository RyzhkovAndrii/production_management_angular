export class MachinePlanItem {

    constructor(
        public machineNumber: number,
        public timeStart: string,
        public productType: number | ProductTypeResponse,
        public productAmount: number,
        public duration?: number
    ) { }

}

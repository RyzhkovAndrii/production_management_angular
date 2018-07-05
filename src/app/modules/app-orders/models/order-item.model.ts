export class OrderItem {

    constructor(
        public orderId: number,
        public productTypeId: number,
        public amount: number,
        public id?: number
    ) { }

}

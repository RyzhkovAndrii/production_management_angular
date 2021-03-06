export class Order {

    constructor(
        public clientId: number,
        public city: string,
        public deliveryDate: string,
        public isImportant: boolean,
        public isDelivered: boolean,
        public actualDeliveryDate?: string,
        public id?: number,
        public creationDate?: string,
        public isOverdue?: boolean
    ) { }

}

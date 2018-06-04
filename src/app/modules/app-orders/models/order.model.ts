export class Order {

    constructor(
        public clientId: number,
        public city: string,
        public deliveryDate: string,
        public isImportant: boolean,
        public isDelivered: boolean,
        public id?: number,
        public isOverdue?: boolean,        
        public creationDate?: string
    ) { }

}

import { Client } from "./client.model";

export class OrderDetails {

    public client: Client;
    public city: string;
    public deliveryDate: string;
    public isImportant: boolean;
    public isDelivered: boolean;
    public id?: number;
    public isOverdue?: boolean;
    public creationDate?: string;
    public orderItemList?: OrderItemResponse[];

    constructor() { }

}
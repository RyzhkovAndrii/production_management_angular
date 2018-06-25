import { Client } from "./client.model";
import { OrderItem } from "./order-item.model";

export class OrderDetails {

    public client: Client;
    public city: string;
    public deliveryDate: string;
    public isImportant: boolean;
    public isDelivered: boolean;
    public actualDeliveryDate?: string
    public id?: number;    
    public creationDate?: string;
    public isOverdue?: boolean;
    public orderItemList?: OrderItem[];

    constructor() { }

}
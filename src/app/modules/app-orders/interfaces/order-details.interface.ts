interface OrderDetails {
    id: number;
    client: ClientResponse;
    city: string;
    creationDate: string;
    deliveryDate: string;
    isImportant: boolean;
    isDelivered: boolean;
    isOverdue: boolean;
    orderItemList: OrderItemResponse[];
}
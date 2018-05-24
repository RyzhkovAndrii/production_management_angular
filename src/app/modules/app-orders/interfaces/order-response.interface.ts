interface OrderResponse {
    id: number;
    clientId: number;
    city: string;
    creationDate: string;
    deliveryDate: string;
    isImportant: boolean;
    isDelivered: boolean;
    isOverdue: boolean;
}
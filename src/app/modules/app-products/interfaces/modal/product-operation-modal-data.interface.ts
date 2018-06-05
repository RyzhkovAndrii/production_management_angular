interface ProductOperationModalData {
    productOperationRequest: ProductOperationRequest;
    productLeftover: ProductLeftoverResponse;
    func(result: Promise < ProductOperationRequest >);
}
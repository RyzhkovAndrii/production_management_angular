interface ProductOperationModalData {
    productOperationRequest: ProductOperationRequest;
    func(result: Promise < ProductOperationRequest >);
}
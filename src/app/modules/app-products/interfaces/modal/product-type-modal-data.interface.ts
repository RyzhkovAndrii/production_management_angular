interface ProductTypeModalData {
    productType ? : ProductTypeRequest;
    operation(result: Promise < ProductTypeRequest >);
}
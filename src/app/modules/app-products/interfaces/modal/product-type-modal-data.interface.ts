interface ProductTypeModalData {
    productType ? : ProductTypeRequest;
    standard ? : Standard;
    operation(result: Promise < ProductTypeRequest >);
}
interface ProductOperationSelectModalData {
  operations: ProductOperationResponse[];
  action(p: Promise < ProductOperationResponse > );
}

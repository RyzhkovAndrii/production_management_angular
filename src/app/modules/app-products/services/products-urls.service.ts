import {
    Injectable
  } from '@angular/core';
  import {
    RestDetailsService
  } from '../../../services/rest-details-service';
  
  @Injectable()
  export class ProductsUrlsService {
    private host = this.restDetails.host;
  
    productTypesUrl = `${this.host}/product-types`;
    productBatchUrl = `${this.host}/product-batches`;
    productLeftoverUrl = `${this.host}/product-leftovers`;
    productOperationUrl = `${this.host}/product-operations`;
    productChecksUrl = `${this.host}/product-checks`;
  
    constructor(private restDetails: RestDetailsService) {}
  }
  
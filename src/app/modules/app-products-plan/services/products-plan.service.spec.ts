import { TestBed, inject } from '@angular/core/testing';

import { ProductsPlanService } from './products-plan.service';

describe('ProductsPlanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductsPlanService]
    });
  });

  it('should be created', inject([ProductsPlanService], (service: ProductsPlanService) => {
    expect(service).toBeTruthy();
  }));
});

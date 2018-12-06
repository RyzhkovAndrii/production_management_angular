import { TestBed, inject } from '@angular/core/testing';

import { RollsPlanService } from './rolls-plan.service';

describe('RollsPlanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RollsPlanService]
    });
  });

  it('should be created', inject([RollsPlanService], (service: RollsPlanService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { StandardsService } from './standards.service';

describe('StandardsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StandardsService]
    });
  });

  it('should be created', inject([StandardsService], (service: StandardsService) => {
    expect(service).toBeTruthy();
  }));
});

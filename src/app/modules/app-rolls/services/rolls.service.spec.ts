import { TestBed, inject } from '@angular/core/testing';

import { RollsService } from './rolls.service';

describe('RollsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RollsService]
    });
  });

  it('should be created', inject([RollsService], (service: RollsService) => {
    expect(service).toBeTruthy();
  }));
});

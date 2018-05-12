import { TestBed, inject } from '@angular/core/testing';

import { AppModalService } from './app-modal.service';

describe('AppModalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppModalService]
    });
  });

  it('should be created', inject([AppModalService], (service: AppModalService) => {
    expect(service).toBeTruthy();
  }));
});

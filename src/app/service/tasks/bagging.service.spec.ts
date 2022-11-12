import { TestBed } from '@angular/core/testing';

import { BaggingService } from './bagging.service';

describe('BaggingService', () => {
  let service: BaggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaggingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

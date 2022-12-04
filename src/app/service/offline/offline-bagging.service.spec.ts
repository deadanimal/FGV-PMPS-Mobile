import { TestBed } from '@angular/core/testing';

import { OfflineBaggingService } from './offline-bagging.service';

describe('OfflineBaggingService', () => {
  let service: OfflineBaggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineBaggingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { OfflineQcService } from './offline-qc.service';

describe('OfflineQcService', () => {
  let service: OfflineQcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineQcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

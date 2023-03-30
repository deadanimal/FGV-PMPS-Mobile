import { TestBed } from '@angular/core/testing';

import { OfflinePollenPrepService } from './offline-pollen-prep.service';

describe('OfflinePollenPrepService', () => {
  let service: OfflinePollenPrepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflinePollenPrepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

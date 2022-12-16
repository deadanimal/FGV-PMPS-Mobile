import { TestBed } from '@angular/core/testing';

import { OfflineHarvestService } from './offline-harvest.service';

describe('OfflineHarvestService', () => {
  let service: OfflineHarvestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineHarvestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { OfflineControlPollinationService } from './offline-control-pollination.service';

describe('OfflineControlPollinationService', () => {
  let service: OfflineControlPollinationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineControlPollinationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

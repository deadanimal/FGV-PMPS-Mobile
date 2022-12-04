import { TestBed } from '@angular/core/testing';

import { OfflineTandanService } from './offline-tandan.service';

describe('OfflineTandanService', () => {
  let service: OfflineTandanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineTandanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { OfflineDefectService } from './offline-defect.service';

describe('OfflineDefectService', () => {
  let service: OfflineDefectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineDefectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { OfflineUserService } from './offline-user.service';

describe('OfflineUserService', () => {
  let service: OfflineUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

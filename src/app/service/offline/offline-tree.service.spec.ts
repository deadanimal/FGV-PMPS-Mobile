import { TestBed } from '@angular/core/testing';

import { OfflineTreeService } from './offline-tree.service';

describe('OfflineTreeService', () => {
  let service: OfflineTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

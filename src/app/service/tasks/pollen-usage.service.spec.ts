import { TestBed } from '@angular/core/testing';

import { PollenUsageService } from './pollen-usage.service';

describe('PollenUsageService', () => {
  let service: PollenUsageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PollenUsageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

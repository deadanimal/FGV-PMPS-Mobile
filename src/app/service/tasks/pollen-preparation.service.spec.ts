import { TestBed } from '@angular/core/testing';

import { PollenPreparationService } from './pollen-preparation.service';

describe('PollenPreparationService', () => {
  let service: PollenPreparationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PollenPreparationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

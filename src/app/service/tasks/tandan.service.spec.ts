import { TestBed } from '@angular/core/testing';

import { TandanService } from './tandan.service';

describe('TandanService', () => {
  let service: TandanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TandanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

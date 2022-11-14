import { TestBed } from '@angular/core/testing';

import { ControlPollinationService } from './control-pollination.service';

describe('ControlPollinationService', () => {
  let service: ControlPollinationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlPollinationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

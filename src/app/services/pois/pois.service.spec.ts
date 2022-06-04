import { TestBed } from '@angular/core/testing';

import { PosService } from './pois.service';

describe('PosService', () => {
  let service: PosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

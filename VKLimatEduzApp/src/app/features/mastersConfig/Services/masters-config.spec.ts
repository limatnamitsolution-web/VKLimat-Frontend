import { TestBed } from '@angular/core/testing';

import { MastersConfig } from './masters-config';

describe('MastersConfig', () => {
  let service: MastersConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MastersConfig);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ValidacionesServiceService } from './validaciones.service.service';

describe('ValidacionesServiceService', () => {
  let service: ValidacionesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidacionesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

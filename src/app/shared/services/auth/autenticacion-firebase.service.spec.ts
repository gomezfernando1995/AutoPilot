import { TestBed } from '@angular/core/testing';

import { AutenticacionFirebaseService } from './autenticacion-firebase.service';

describe('AutenticacionFirebaseService', () => {
  let service: AutenticacionFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutenticacionFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

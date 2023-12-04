import { TestBed } from '@angular/core/testing';

import { FuncionesVariadasService } from './funciones-variadas.service';

describe('FuncionesVariadasService', () => {
  let service: FuncionesVariadasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuncionesVariadasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

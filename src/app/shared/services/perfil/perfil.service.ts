import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  isModalPerfil= false;
  
  setOpen(isOpen: boolean) {
    this.isModalPerfil = isOpen;
  }

  constructor() { }
}

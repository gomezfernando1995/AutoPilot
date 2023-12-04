import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  isDesktop: boolean = window.innerWidth > 768; // Establece el valor inicial

  constructor() {}
  ngOnInit(): void {
    window.addEventListener('resize', () => {
      this.isDesktop = window.innerWidth > 768; // Actualiza el valor al cambiar el tamaño de la ventana
    });
  }

  

}

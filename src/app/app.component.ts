import { Component } from '@angular/core';
import { FuncionesVariadasService } from './shared/services/funcionesVariadas/funciones-variadas.service';
import { AutenticacionFirebaseService } from './shared/services/auth/autenticacion-firebase.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  isDesktop: boolean = window.innerWidth > 768; // Establece el valor inicial

  constructor(public authService: AutenticacionFirebaseService,
    ) {}

  ngOnInit() {
    window.addEventListener('resize', () => {
      this.isDesktop = window.innerWidth > 768; // Actualiza el valor al cambiar el tamaño de la ventana
    });
  }
}

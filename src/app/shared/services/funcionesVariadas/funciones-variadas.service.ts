import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class FuncionesVariadasService {
  constructor(public toastController: ToastController) {}

  // ***************************************** MENSAJE A MOSTRAR ************************************************

  mostrarMensajeDeLogin(mensaje: string, icono: string) {
    this.toastController
      .create({
        message: mensaje,
        duration: 3000, // Duración en milisegundos
        position: 'bottom', // Posición de la tostada ('top', 'bottom', 'middle', etc.)
        cssClass: 'custom-toast',
        buttons: [
          {
            side: 'start',
            icon: icono, // Icono de inicio
            role: 'icon-button',
            cssClass: 'custom-toast-icon',
          },
        ],
      })
      .then((toast) => {
        toast.present(); // Muestra la tostada
      });
  }
}

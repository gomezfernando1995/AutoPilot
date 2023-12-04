import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'displayHora'
})
export class DisplayHoraPipe implements PipeTransform {

  transform(value: Timestamp | undefined): string {
    if (value instanceof Timestamp) {
      const fechaMillis = value.toMillis();
      const fecha = new Date(fechaMillis);

      // Obtener las partes de la hora
      const horas = fecha.getHours();
      const minutos = fecha.getMinutes();

      // Formatear la hora
      const formattedHour = `${this.padNumber(horas % 12 || 12)}:${this.padNumber(minutos)} ${horas >= 12 ? 'PM' : 'AM'}`;

      return formattedHour;
    }

    return ''; // O cualquier valor predeterminado que desees cuando value es undefined
  }

  private padNumber(num: number): string {
    return num.toString().padStart(2, '0');
  }

}

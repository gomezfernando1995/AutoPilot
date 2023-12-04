import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';
@Pipe({
  name: 'displayFecha'
})
export class DisplayFechaPipe implements PipeTransform {
  transform(value: Timestamp | undefined): string {
    if (value instanceof Timestamp) {
      const fechaMillis = value.toMillis();
      const fecha = new Date(fechaMillis);

      // Obtener las partes de la fecha
      const dia = fecha.getDate();
      const mes = fecha.getMonth() + 1; // ¡Recuerda que los meses comienzan desde 0!
      const anio = fecha.getFullYear();
      const horas = fecha.getHours();
      const minutos = fecha.getMinutes();

      // Formatear la fecha y la hora
      const formattedDate = `${this.padNumber(dia)}/${this.padNumber(mes)}/${anio}, ${this.padNumber(horas % 12 || 12)}:${this.padNumber(minutos)} ${horas >= 12 ? 'PM' : 'AM'}`;

      return formattedDate;
    }

    return ''; // O cualquier valor predeterminado que desees cuando value es undefined
  }

  private padNumber(num: number): string {
    return num.toString().padStart(2, '0');
  }
}

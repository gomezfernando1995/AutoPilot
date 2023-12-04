import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';
@Pipe({
  name: 'orderByFecha'
})
export class OrderByFechaPipe implements PipeTransform {

  transform(array: any[]): any[] {
    if (!Array.isArray(array)) {
      return array;
    }

    return array.slice().sort((a, b) => a.sentDate - b.sentDate);
  }
 
}

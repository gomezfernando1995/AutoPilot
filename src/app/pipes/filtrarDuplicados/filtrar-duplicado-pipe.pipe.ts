import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrarDuplicadoPipe'
})
export class FiltrarDuplicadoPipePipe implements PipeTransform {

  transform(value: any[]): any[] {
    if (!Array.isArray(value)) {
      return value;
    }
    return value.filter((element, index, self) => {
      return self.findIndex((e) => e.marca === element.marca && e.modelo === element.modelo) === index;
    });
  }

}

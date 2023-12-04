import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltrarDuplicadoPipePipe } from './filtrarDuplicados/filtrar-duplicado-pipe.pipe';

@NgModule({
  declarations: [FiltrarDuplicadoPipePipe ],
  imports: [
    CommonModule
  ],
  exports:[
    FiltrarDuplicadoPipePipe
  ]
})
export class PipesModule { }

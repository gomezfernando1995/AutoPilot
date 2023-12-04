import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NegocioPageRoutingModule } from './negocio-routing.module';

import { NegocioPage } from './negocio.page';
import { PerfilComponent } from './component/perfil/perfil.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NegocioPageRoutingModule
  ],
  declarations: [NegocioPage,PerfilComponent]
})
export class NegocioPageModule {}

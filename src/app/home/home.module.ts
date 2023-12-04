
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//************** MODULOS **************
import { HomePageRoutingModule } from './home-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

//************** COMPONENTES**************
import { HomePage } from './home.page';
import { NavbarComponent } from './navbar/navbar.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { ContactanosComponent } from './contactanos/contactanos.component';

import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [HomePage,NavbarComponent,NosotrosComponent,ContactanosComponent],
  imports: [
    CommonModule,
    HomePageRoutingModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule
  ],
  exports: [
    NavbarComponent,
  ],
})
export class HomePageModule {}

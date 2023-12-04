import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//************** MODULOS **************
import { AutenticacionRoutingModule } from './autenticacion-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePageModule } from '../home/home.module';

//************** COMPONENTES**************
import { LoginComponent } from './login/login.component'; 
import { RegistrarComponent } from './registrar/registrar.component';

@NgModule({
  declarations: [  LoginComponent, RegistrarComponent],
  imports: [
    CommonModule,  
    AutenticacionRoutingModule,
    FormsModule,
    IonicModule,
    HomePageModule,
    ReactiveFormsModule,
  ]
  
})
export class AutenticacionModule { }

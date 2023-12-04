//imports principales
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// imports componentes
import { LoginComponent } from './login/login.component';
import { RegistrarComponent } from './registrar/registrar.component';

//HOJA DE RUTAS
const routes: Routes = [
  { 
    path:'',
    children:[
      { path:'login',  component: LoginComponent },
      { path:'registrar',  component: RegistrarComponent },
    ],
  },
 
 
];

@NgModule({
  declarations: [ ],
  imports: [ CommonModule, RouterModule.forChild(routes) ],
  exports: [RouterModule] 
   
})
export class AutenticacionRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './home.page';
import { NavbarComponent } from './navbar/navbar.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { ContactanosComponent } from './contactanos/contactanos.component';


const routes: Routes = [
  { path:'',  component: HomePage },
  { path:'navbar',  component: NavbarComponent },
  { path:'home',  component: HomePage },
  { path:'nosotros',  component: NosotrosComponent },
  { path:'contacto',  component: ContactanosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}

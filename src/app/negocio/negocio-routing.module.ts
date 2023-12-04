import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NegocioPage } from './negocio.page';
import { WelcomeComponent } from './component/welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: NegocioPage,
    children:[{ path:'welcome',  component: WelcomeComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NegocioPageRoutingModule {}

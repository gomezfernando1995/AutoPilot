import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guard/auth.guard';
import { HomeGuard } from './shared/guard/home.guard';

const routes: Routes = [

  {
    path: 'home',
    loadChildren: () =>import('./home/home.module').then((m) => m.HomePageModule),canActivate: [HomeGuard]
  },
  {
    path: 'autenticacion',
    loadChildren: () =>import('./autenticacion/autenticacion.module').then((m) => m.AutenticacionModule),canActivate: [HomeGuard]
  },
  {
    path: 'negocio',
    loadChildren: () => import('./negocio/negocio.module').then( (m) => m.NegocioPageModule),canActivate: [AuthGuard]
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule),canActivate: [AuthGuard]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'vehiculos',
    loadChildren: () => import('./vehiculos/vehiculos.module').then( m => m.VehiculosPageModule),canActivate: [AuthGuard]
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

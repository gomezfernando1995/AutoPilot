import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map((user) => {
        if (!user) {  // si el usuario no esta logeado devuelve que puede acceder, pero si esta logeado no deja ingresar y retorna a 
          return true ;
        }
        this.router.navigate(['/welcome']);
        return true;
      })
    );
  }
}

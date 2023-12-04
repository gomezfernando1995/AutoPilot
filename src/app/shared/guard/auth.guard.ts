import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { AutenticacionFirebaseService } from '../services/auth/autenticacion-firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private authService: AutenticacionFirebaseService
  ) {}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map((user) => {
        if (user) {
          return true;
        }
        this.router.navigate(['/home']);
        return false;
      })
    );
  }
}

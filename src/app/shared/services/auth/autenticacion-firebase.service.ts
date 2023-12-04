import { Injectable } from '@angular/core';
import { GoogleAuthProvider} from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionFirebaseService {
  actualUser$: Observable<firebase.User | null>;
  logeado: boolean = false;

  constructor(private afAuth: AngularFireAuth) {
    this.actualUser$ = this.afAuth.authState;
  }

  // ******************************        LOGIN CON GOOGLE        *************************************

  loginGoogle(): Promise<firebase.auth.UserCredential> {
    return this.afAuth.setPersistence('local').then(() => {
      this.afAuth.authState.subscribe((user) => {
        localStorage.setItem('uid', user!.uid);
      });
      this.logeado = true;
      return this.afAuth.signInWithPopup(new GoogleAuthProvider());
    });
  }

  // ****************************** LOGIN CON EMAIL Y CONTRASEÑA *****************************************

  loginEmailAndPassword(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    return this.afAuth.setPersistence('local').then(() => {
      this.logeado = true;
      return this.afAuth.signInWithEmailAndPassword(email, password);
    });
  }

  // ****************************** REGISTRO CON EMAIL Y CONTRASEÑA ***************************************

  registroEmailPassword(email: string, password: string): Promise<firebase.auth.UserCredential>{
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        return userCredential;
      })
      .catch((error) => {
        console.error('Error al registrar el usuario', error);
        throw error;;
      });

     
  }

 

  // ****************************** DESLOGUEO ***************************************************************

  logout() {
    this.logeado = false;
    localStorage.removeItem('uid');
    this.afAuth.signOut();
  }

  // ****************************** GUARDAR DATOS EN FIRESTORE ************************************************
}

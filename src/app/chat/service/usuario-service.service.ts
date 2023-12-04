import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  getDocs,
  query,
  QuerySnapshot,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { catchError, from, Observable, of, switchMap } from 'rxjs';
import { ProfileUser } from '../../models/user.model';
import { AutenticacionFirebaseService } from '../../shared/services/auth/autenticacion-firebase.service';
import { DocumentData } from 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class UsuarioServiceService {
  constructor(
    private firestore: Firestore,
    private authService: AutenticacionFirebaseService,
    private auth:AngularFireAuth
  ) {}
   uid: any;

  /**************************************************************************************************************************************************************
   *  @description Obtenemos la coleccion de usuarios desde firebase, una vez obtenida nos trae una QuerySnapshot y esta es iterada y guardada en un array.
   *  
   *  @returns Retorna un observable la cual tiene una lista de usuarios.
   ***************************************************************************************************************************************************************/

  get getUsuarios(): Observable<ProfileUser[]> {

    const usersCollection = collection(this.firestore, 'users');
    return new Observable<any[]>((observer) => {
      getDocs(usersCollection)
        .then((querySnapshot: QuerySnapshot) =>{  // UN QuerySnapshot ES LA COLECCION RETORNADA POR FIREBASE.
          const users: any[] = [];               // Creo un array para cuando intere el QuerySnapshot guarde la informacion.
          querySnapshot.forEach((doc) => {
            users.push(doc.data());             //Itero el QuerySnapshot y lo guardo en el array, una vez finalizado se devuelve como un observable.
          });
          observer.next(users);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    }).pipe(
      catchError((error) => {
        console.error('Error al obtener usuarios:', error);
        throw error;
      })
    );
  }

 /**************************************************************************************************************************************************************
   *  @description Obtenemos el usuario que esta logeado .
   *  
   *  @returns Retorna un observable de usuario.
   ***************************************************************************************************************************************************************/

get usuarioLogeado$(): Observable<ProfileUser | null> {
    return this.authService.actualUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = doc(this.firestore, 'users', user.uid);
        return docData(ref) as Observable<ProfileUser>;
      })
    );
  }


  getChatsForCurrentUser(): Promise<string | null> {
    return new Promise<string | null>((resolve, reject) => {
      const authSubscription = this.auth.authState.subscribe((user) => {
        if (user) {
          this.uid = user.uid;
          authSubscription.unsubscribe(); // Desuscribirse una vez que se obtenga el uid
          resolve(this.uid);
        } else {
          authSubscription.unsubscribe(); // Desuscribirse en caso de que no haya usuario autenticado
          resolve(null);
        }
      });
    });
  }




}

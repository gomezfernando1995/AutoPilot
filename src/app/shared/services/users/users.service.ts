import { Injectable } from '@angular/core';
import { getNgModuleById, inject } from '@angular/core';
import { Observable, from, of, switchMap } from 'rxjs';
import { ProfileUser } from 'src/app/models/user.model';
import { AutenticacionFirebaseService } from '../auth/autenticacion-firebase.service';
import {
  collection,
  doc,
  Firestore,
  setDoc,
  docData,
  query,
  updateDoc,
  addDoc,
  collectionData,
} from '@angular/fire/firestore';
import { UsuarioServiceService } from 'src/app/chat/service/usuario-service.service';
import { map, first } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class UsersService {
  firestore: Firestore = inject(Firestore);
  uid$?: string;
  email$?: string;
  displayName$?: string;
  photoURL$?: string;
  firstName$?: string;
  lastName$?: string;
  phone$?: string;
  address$?: string;
  flagUserSelect:boolean=false;

  constructor(
    private authService: AutenticacionFirebaseService,
    private serviceUsuario: UsuarioServiceService
  ) {
    this.dataUserLoggedIn();
  }

  /******************************************************* AGREGAR UN USUARIO  A LA COLECCION ************************************/
  addUsuario(usuario: ProfileUser) {
    const coleccionUsuario = collection(this.firestore, 'users');
    return addDoc(coleccionUsuario, usuario);
  }

  // ************************************************** AGREGAMOS AL USUARIO A FIREBASE    ***************************************/
  addUser(user: ProfileUser): Observable<any> {
    const ref = doc(this.firestore, 'users', user?.uid);
    return from(setDoc(ref, user));
  }

  /********************************************* CONSULTAMOS INFORMACION DEL USUARIO LOGEADO    ***************************************************/

  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authService.actualUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = doc(this.firestore, 'users', user?.uid);
        console.log(ref);
        return docData(ref) as Observable<ProfileUser>;
      })
    );
  }

  // ****************************************   OBTENEMOS TODOS LOS USUARIO DE FIRESTORE   ************************************************
  
  get allUsers$(): Observable<ProfileUser[]> {
    const userCollection = collection(this.firestore, 'users');
    const queryAll = query(userCollection);
    return collectionData(queryAll) as Observable<ProfileUser[]>;
  }

  // ****************************************   ACTUALIZAMOS AL USUARIO A FIREBASE  ***************************************************
  
  updateUser(user: ProfileUser): Observable<any> {
    const ref = doc(this.firestore, 'users', user?.uid);
    return from(updateDoc(ref, { ...user }));
  }

  // ****************************************   OBTENER DATOS DEL USUARIO LOGEADO Y LO BUSCA EN FIREDATABASE  ********************************************

  dataUserLoggedIn() {
    this.authService.actualUser$.subscribe((userLogeado) => {
      this.serviceUsuario.getUsuarios.subscribe((usuarios) => {
        const usuarioEncontrado = usuarios.find(
          (usuario) => usuario.uid === userLogeado?.uid
        );
        if (usuarioEncontrado) {
          this.uid$ = usuarioEncontrado.uid;
          this.email$ = usuarioEncontrado.email;
          this.displayName$ = usuarioEncontrado.displayName;
          this.photoURL$ = usuarioEncontrado.photoURL;
          this.firstName$ = usuarioEncontrado.firstName;
          this.lastName$ = usuarioEncontrado.lastName;
          this.phone$ = usuarioEncontrado.phone;
          this.address$ = usuarioEncontrado.address;
        } else {
          console.error('Usuario no encontrado');
        }
      });
    });
  }

  // ***********************************************   BUSCAMOS UN USUARIO SEGUN SU ID   ***************************************************

  searchUserById(id: string | undefined): Observable<boolean> {
    return this.serviceUsuario.getUsuarios.pipe(
      map(usuarios => !!usuarios.find(usuario => usuario.uid.trim() === (id ?? '').trim())),
      first()
    );
  }

  // searchUserByEmail(email: string | undefined): Observable<boolean> {
  //   return this.serviceUsuario.getUsuarios.pipe(
  //     map(usuarios => !!usuarios.find(usuario => usuario.email.trim() === (email ?? '').trim())),
  //     first()
  //   );
  // }


}

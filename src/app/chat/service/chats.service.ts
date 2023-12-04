import { Injectable } from '@angular/core';
import { ProfileUser } from 'src/app/models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Chat,Message } from 'src/app/models/chat.model';
import {
  Observable,
  catchError,
  switchMap,
} from 'rxjs';
import {
  updateDoc,
  collection,
  Timestamp,
  doc,
  Firestore,
  query,
  where,
  getDocs,
  setDoc,
  addDoc,
  QuerySnapshot,
} from '@angular/fire/firestore';

import { UsersService } from 'src/app/shared/services/users/users.service';
import { AutenticacionFirebaseService } from 'src/app/shared/services/auth/autenticacion-firebase.service';
import { orderBy } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  public uid: any;

  constructor(
    private firestore: Firestore,
    private auth: AngularFireAuth,
    private usuarioService: UsersService,
    private authService: AutenticacionFirebaseService
  ) {}


  /****************************************************************************************************************************
   * @description Crea el hcat entre el usuario logeado y el el usuario seleccionado
   * @param otherUser Es el usuario seleccionado
   *
   ***************************************************************************************************************************/
  createChat(otherUser: ProfileUser) {
    this.auth.authState.subscribe((user) => {
      if (user) {
        const displayU = this.usuarioService.displayName$;
        const fotoU = this.usuarioService.photoURL$;

        const chatId = user.uid + otherUser.uid;
        const chatRef = doc(this.firestore, 'chats', chatId);
        console.log(user.displayName);
        setDoc(chatRef, {
          id: chatId,
          ultimoMensaje: [''],
          ultimoMensajeTiempo: [''],
          userIds: [user?.uid, otherUser.uid],
          users: [
            {
              displayName: displayU,
              photoURL: fotoU,
            },
            {
              displayName: otherUser.displayName || '',
              photoURL: otherUser.photoURL,
            },
          ],
        });
      } else {
        console.log('No se crear el chat correctamente.');
      }
    });
  }

  /****************************************************************************************************************************
   * @description Crea el hcat entre el usuario logeado y el el usuario seleccionado
   * @param otherUser Es el usuario seleccionado
   *
   ***************************************************************************************************************************/

  get get_Chats(): Observable<Chat[]> {
    return this.auth.authState.pipe(
      switchMap((user) => {
        if (user) {
          const uid = user.uid;
          const chatCollection = collection(this.firestore, 'chats');
          const queryForUserChats = query(
            chatCollection,
            where('userIds', 'array-contains', uid)
          );

          return new Observable<Chat[]>((observer) => {
            getDocs(queryForUserChats)
              .then((querySnapshot) => {
                const chats: Chat[] = [];
                querySnapshot.forEach((doc) => {
                  chats.push(doc.data() as Chat);
                });
                observer.next(chats);
                observer.complete();
              })
              .catch((error) => {
                observer.error(error);
              });
          });
        } else {
          // Handle the case when the user is not authenticated
          return [];
        }
      }),
      catchError((error) => {
        console.error('Error al obtener los chats:', error);
        throw error;
      })
    );
  }

    /****************************************************************************************************************************
   * @description Crea el hcat entre el usuario logeado y el el usuario seleccionado
   * @param otherUser Es el usuario seleccionado
   *
   ***************************************************************************************************************************/

  create_MessageChats(chatId: string, msj: string) {
    const ref = collection(this.firestore, 'chats', chatId, 'message');
    const chatRef = doc(this.firestore, 'chats', chatId);
    const fecha = Timestamp.fromDate(new Date());
    this.authService.actualUser$.subscribe((user) => {
      if (user) {
        console.log(ref.id);
        addDoc(ref, {
          text: msj,
          senderId: user?.uid,
          sentDate: fecha,
        });
        updateDoc(chatRef, {
          ultimoMensaje: msj,
          ultimoMensajeTiempo: fecha,
        });
      }
    });
  }

    /**************************************************************************************************************************
   * @name GET DE MENSAJES CHATS
   * @description Obtenedremos los mensajes del chat seleccionado , la misma se rellenara en pantalla
   * @param chatId Trae el Id del chat seleccionado, con el mismo se hace la query para traer los mensajes de chat solicitado
   *
   ***************************************************************************************************************************/

    get_MessageChats(chatId: string): Observable<Message[]> {
      const msjCollection = collection(this.firestore, 'chats', chatId, 'message');
      const msjQuery = query(msjCollection, orderBy('sentDate', 'asc')); // Cambiado a 'desc' para obtener el orden desde el más reciente hasta el más antiguo
    
      return new Observable<any[]>((observer) => {
        getDocs(msjQuery)
          .then((querySnapshot: QuerySnapshot) => {
            const msj: any[] = [];
            querySnapshot.forEach((doc) => {
              msj.push(doc.data());
            });
            observer.next(msj);
            observer.complete();
          })
          .catch((error) => {
            observer.error(error);
          });
      }).pipe(
        catchError((error) => {
          console.error('Error al obtener mensajes del chat:', error);
          throw error;
        })
      );
    }


}

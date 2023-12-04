import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  collection,
  doc,
  Firestore,
  query,
  where,
  getDocs,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, catchError, concatMap, from, map, switchMap } from 'rxjs';
import { vehiculo } from '../models/vehiculo.model';
import { userVehiculo } from '../models/userVehiculo.model';


@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  constructor( private firestore: Firestore,private auth: AngularFireAuth) { }

  // ***************************************** GET VEHICULO ***********************************

  get getVehiculos(): Observable<vehiculo[]> {
          const vehiculosCollection = collection(this.firestore, 'vehiculos');
          return new Observable<vehiculo[]>((observer) => {
            getDocs(vehiculosCollection)
              .then((querySnapshot) => {
                const vehiculos: vehiculo[] = [];
                querySnapshot.forEach((doc) => {
                  vehiculos.push(doc.data() as vehiculo);
                });
                observer.next(vehiculos);
                observer.complete();
              })
              .catch((error) => {
                observer.error(error);
              });
          });
  }
  
  // ***************************************** GET USUARIO VEHICULO ***********************************

get getUsuarioVehiculos(): Observable<userVehiculo[]> {
  return this.auth.authState.pipe(
    switchMap((user) => {
      if (user) {
        const uid = user.uid;

        const vehiculosCollection = collection(this.firestore, 'userVehiculos');
        const queryForUserChats = query(
          vehiculosCollection,
          where('uid', '==', uid)
        );
        return new Observable<userVehiculo[]>((observer) => {
          getDocs(queryForUserChats)
            .then((querySnapshot) => {
              const vehiculos: userVehiculo[] = [];
              querySnapshot.forEach((doc) => {
                vehiculos.push(doc.data() as userVehiculo);
              });
              observer.next(vehiculos);
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


}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
//FIREBASE
import {
  AngularFireAuth,
  AngularFireAuthModule,
} from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import { FIREBASE_APP_NAME, FIREBASE_OPTIONS } from '@angular/fire/compat';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

//************** MODULOS **************
import { AppRoutingModule } from './app-routing.module';
import { HomePageModule } from './home/home.module';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { AutenticacionFirebaseService } from './shared/services/auth/autenticacion-firebase.service';
import { NegocioPageModule } from './negocio/negocio.module';
import { ValidacionesServiceService } from './shared/services/validaciones/validaciones.service.service';
import { ChatPageModule } from './chat/chat.module';



@NgModule({
  declarations: [AppComponent],
  imports: [
    FormsModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    AutenticacionModule,
    HomePageModule,
    HttpClientModule,
    NegocioPageModule,
    ChatPageModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },
    ValidacionesServiceService,AutenticacionFirebaseService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}

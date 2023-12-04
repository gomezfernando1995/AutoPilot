import { Component, OnInit, inject } from '@angular/core';
import { AutenticacionFirebaseService } from '../../shared/services/auth/autenticacion-firebase.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidacionesServiceService } from 'src/app/shared/services/validaciones/validaciones.service.service';
import { FuncionesVariadasService } from 'src/app/shared/services/funcionesVariadas/funciones-variadas.service';
import { Router } from '@angular/router';
import {
  doc,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UsersService } from 'src/app/shared/services/users/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public formUsuario: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(this.serviceValidaciones.emailPattern),
      Validators.maxLength(50),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(this.serviceValidaciones.passwordPattern),
      Validators.minLength(4),
    ]),
  });

  public valor: string = '';
  firestore: Firestore = inject(Firestore);
  inputType: string = 'password';
  inputValue: string = '';

  // ------------------------------------------ CONTRUCTOR Y ON INIT ------------------------------------------
  constructor(
    private serviceGoogle: AutenticacionFirebaseService,
    private serviceValidaciones: ValidacionesServiceService,
    private router: Router,
    private usuarioService:UsersService,
    private auth: AngularFireAuth,
    private serviceVariado: FuncionesVariadasService
  ) {}
  ngOnInit() {
    this.formUsuario.reset();
  }


  // ***************************************** VISIBILIDAD DE PASSWORD ***********************************

  togglePasswordVisibility() {
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }

  // ***************************************** LOGIN GOOGLE ************************************************

  loginGoogle() {
    this.serviceGoogle
      .loginGoogle()
      .then((userCredential) => {

        console.log(this.usuarioService.searchUserById(userCredential.user?.uid))
        if(this.usuarioService.searchUserById(userCredential.user?.uid)){
          this.serviceVariado.mostrarMensajeDeLogin(' Login exitoso !',"person");
          this.router.navigate(['/negocio/welcome']);
        }else{
          console.log("el vago esta sin registrar en firebaseStore, vamos a guardarlo");
          this.guardarDatosDeUsuario_register();
          this.serviceVariado.mostrarMensajeDeLogin(' Login exitoso ! Guardamos en Firestore el usuario de Google',"person");
          this.router.navigate(['/negocio/welcome']);
        }
      })
      .catch((error) => {
        this.serviceVariado.mostrarMensajeDeLogin(
          'Error al iniciar sesion !',
          'alert-circle'
        );
        console.error('Error al iniciar sesión con Google', error);
      });
  }

  // ***************************************** LOGIN ************************************************

  login() {
    const email: string = this.formUsuario.get('email')?.value;
    const password: string = this.formUsuario.get('password')?.value;

    this.serviceGoogle
      .loginEmailAndPassword(email, password)
      .then((userCredential) => {
        // this.serviceVariado.mostrarMensajeDeLogin(' Login exitoso !',"person")
        this.router.navigate(['/negocio/welcome']);

        console.log('Bienvenido : ', userCredential);
      })
      .catch((error) => {
        this.serviceVariado.mostrarMensajeDeLogin(
          'Usuario inexistente !',
          'alert-circle'
        );
        console.error(
          'Error, el usuario ingresado no existe o esta mal escrito , tipo de error:  : ',
          error
        );
      });
  }

  // ***************************************** GUARDAR DATOS DEL USUARIO ***********************************
  // tipoRegister : 1 es google , 0 es por la web
  guardarDatosDeUsuario_register() {
    this.auth.authState.subscribe((user) => {
      if (user) {
        const id = user.uid;
           setDoc(doc(this.firestore, 'users', id.toString()), {
            uid: id,
            correo: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            firstName: user.displayName,
            lastName: user.displayName,
            phone: user.phoneNumber,
            address: '',
          });
          console.log('USUARIO ALMACENADO CORRECTAMENTE POR GOOGLE');
        
      } else {
        console.log('No se pudo guardar los datos correctamente.');
      }
    });
  }


}

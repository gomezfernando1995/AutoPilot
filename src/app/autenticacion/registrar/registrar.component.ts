import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { usuario } from 'src/app/shared/usuario_interfaz';
import { ValidacionesServiceService } from 'src/app/shared/services/validaciones/validaciones.service.service';
import { AutenticacionFirebaseService } from '../../shared/services/auth/autenticacion-firebase.service';
// import { Firestore, doc, setDoc } from 'firebase/firestore';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { user } from '@angular/fire/auth';
import { LoginComponent } from '../login/login.component';
import { FuncionesVariadasService } from 'src/app/shared/services/funcionesVariadas/funciones-variadas.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss'],
})
export class RegistrarComponent implements OnInit {
  firestore: Firestore = inject(Firestore);

  public miFormulario: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    displayName: new FormControl(''),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(this.serviceValidacion.emailPattern),
      Validators.maxLength(50),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(this.serviceValidacion.passwordPattern),
      Validators.minLength(4),
    ]),
  });

  constructor(
    private router: Router,
    public http: HttpClient,
    private auth: AngularFireAuth,
    private serviceValidacion: ValidacionesServiceService,
    private serviceAutenticacion: AutenticacionFirebaseService,
    private tostada: FuncionesVariadasService
  ) {}

  ngOnInit() {
    this.miFormulario.reset();
  }

   email!:string ;
   password!:string;
   nombre!: string;
   displayName!: string;

  // ***************************************** REGISTRARSE CON GOOGLE : no se usa xq hace lo mismo cuando se logea ***********************************

  // registroGoogle() {
  //   this.serviceAutenticacion
  //     .loginGoogle()
  //     .then((userCredential) => {
  //       this.guardarDatosDeUsuario_register(1);
  //       this.tostada.mostrarMensajeDeLogin(' Registro exitoso por google!', 'person');
  //       this.router.navigate(['/login']);
  //     })
  //     .catch((error) => {
  //       if (error.code !== 'auth/popup-closed-by-user') {
  //         this.tostada.mostrarMensajeDeLogin(
  //           'Error al intentar registrarse !',
  //           'alert-circle'
  //         );

  //         // Ocurrió un error durante la autenticación, pero no es debido al cierre de la ventana emergente.
  //         console.error('Error de autenticación:', error);
  //       }
  //     });
  // }

  // ***************************************** REGISTRARSE CON EMAIL Y CONTRASEÑA ***********************************

  registrarEnFirebase() {
    this.email = this.miFormulario.get('email')?.value;
    this.password = this.miFormulario.get('password')?.value;
    this.nombre= this.miFormulario.get('nombre')?.value;
    this.displayName= this.miFormulario.get('displayName')?.value;

      try {
        const userFirebase = this.serviceAutenticacion.registroEmailPassword(
          this.email,
          this.password
        );
        userFirebase.then(user=>{
          if(user.user?.uid != undefined){
            this.guardarDatosDeUsuario_register(user.user.uid );
            this.tostada.mostrarMensajeDeLogin(' Registro exitoso !', 'person');
            this.router.navigate(['/negocio/welcome']);
          } 
        })
      
      } catch (error) {
        console.log('hubo un error en registrarEnFirebase() : ', error);
      }
    
  }
  // ***************************************** GUARDAR DATOS DEL USUARIO ***********************************
  // tipoRegister : 1 es google , 0 es por la web
  guardarDatosDeUsuario_register(uId: string) {
    const id = uId;
    if (id != '') {
      setDoc(doc(this.firestore, 'users', id.toString()), {
        uid: id,
        correo: this.email,
        displayName: this.displayName,
        photoURL: 'https://i.ibb.co/PCKNDH1/perfil.png',
        firstName: this.nombre,
        lastName: '',
        phone: '',
        address: '',
      });
      console.log('USUARIO ALMACENADO CORRECTAMENTE POR LA WEB');
    } else {
      console.log('No se pudo guardar los datos correctamente.');
    }
  }

  //---------------------------------------- VALIDACIONES DE LOS INPUTS --------------------------------------------------------------------

  getErrorMessageEmail() {
    if (this.miFormulario.get('email')?.hasError('required')) {
      return 'Debes ingresar un correo';
    }
    return this.miFormulario.get('email')?.hasError('pattern')
      ? 'No es un email valido'
      : '';
  }

  getErrorMessageTelefono() {
    if (this.miFormulario.get('telefono')?.hasError('required')) {
      return 'Debes ingresar un teléfono';
    } else if (this.miFormulario.get('telefono')?.hasError('minlength')) {
      return 'El número no puede tener menos de 10 caracteres';
    } else if (this.miFormulario.get('telefono')?.hasError('maxlength')) {
      return 'El número no puede tener más de 10 caracteres';
    } else if (this.miFormulario.get('telefono')?.hasError('pattern')) {
      return 'No es un teléfono válido';
    }
    return '';
  }

  getErrorMessageUsuario() {
    if (this.miFormulario.get('nombreUsuario')?.hasError('required')) {
      return 'Debes ingresar un nombre de usuario';
    } else if (this.miFormulario.get('nombreUsuario')?.hasError('minlength')) {
      return 'El número no puede tener menos de 3 caracteres';
    } else if (this.miFormulario.get('nombreUsuario')?.hasError('maxlength')) {
      return 'El número no puede tener más de 50 caracteres';
    }
    return '';
  }
  getErrorMessagePassword() {
    if (this.miFormulario.get('password')?.hasError('required')) {
      return 'Debes crear una contraseña';
    } else if (this.miFormulario.get('password')?.hasError('minlength')) {
      return 'Debe tener almenos 8 caracteres ';
    } else if (this.miFormulario.get('password')?.hasError('pattern')) {
      return 'Debe estar constituida por almenos una mayuscula,minuscula y caracter especial';
    }
    return '';
  }
  getErrorMessageTerminos() {
    if (this.miFormulario.get('terminos')?.hasError('requiredTrue')) {
      return 'Debes aceptar terminos y condiciones para registrarte';
    }

    return '';
  }

  //---------------------------------------- FIN VALIDACIONES DE LOS INPUTS --------------------------------------------------------------------
}

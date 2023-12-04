import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioServiceService } from 'src/app/chat/service/usuario-service.service';
import { AutenticacionFirebaseService } from 'src/app/shared/services/auth/autenticacion-firebase.service';
import { FuncionesVariadasService } from 'src/app/shared/services/funcionesVariadas/funciones-variadas.service';
import { PerfilService } from 'src/app/shared/services/perfil/perfil.service';
import { UsersService } from 'src/app/shared/services/users/users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isDesktop: boolean = window.innerWidth > 768; // Establece el valor inicial
  fotoPerfil: any;
  nombre: any;
  usuarios$ = this.serviceUsuario.getUsuarios;

  constructor(
    public serviceAuth: AutenticacionFirebaseService,
    private serviceUsuario: UsuarioServiceService,
    private router: Router,
    private usersService: UsersService,
    public servicePerfil: PerfilService

  ) {}

  ngOnInit() {
    window.addEventListener('resize', () => {
      this.isDesktop = window.innerWidth > 768; // Actualiza el valor al cambiar el tamaño de la ventana
    });
    this.obtenerImagen();
  }

  obtenerImagen() {
    this.serviceAuth.actualUser$.subscribe((userLogeado) => {
      this.serviceUsuario.getUsuarios.subscribe((usuarios) => {
        const usuarioEncontrado = usuarios.find(
          (usuario) => usuario.uid === userLogeado?.uid
        );

        if (usuarioEncontrado) {
          // Si se encuentra al usuario, obtén el nombre y la foto de perfil
          this.nombre = usuarioEncontrado.displayName;
          this.fotoPerfil = usuarioEncontrado.photoURL;
        } else {
          // Manejar el caso en que no se encuentre al usuario
          console.error('Usuario no encontrado');
        }
      });
    });
  }

  salir() {
    this.usersService.flagUserSelect=false;
    this.serviceAuth.logout();
    this.router.navigate(['/home']);
  }

 
}

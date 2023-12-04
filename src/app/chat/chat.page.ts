import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { ProfileUser } from '../models/user.model';
import { UsuarioServiceService } from './service/usuario-service.service';
import { ChatsService } from './service/chats.service';
import { Firestore, collectionData } from '@angular/fire/firestore';
import {
  combineLatest,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { Chat, Message } from '../models/chat.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UsersService } from '../shared/services/users/users.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild('endOfChat')
  endOfChat: ElementRef | undefined;

  
   

  isDesktop: boolean = window.innerWidth > 768; // Establece el valor inicial

  chats$: Observable<Chat[]>;  // Guarda  los chats del usuario registrado
  selectedUsuario!: Chat;     // Guarda el usuario seleccionado
  searchUser!: ProfileUser;  // Guarda el usuario buscado para chatear
  usuarios$ = this.usuariosService.getUsuarios; //Guarda la lista obtenida de usuarios(bd) 
  searchText: string = '';
  fotoSelected!: string;
  nombreSelected!: string;
  users: any[] = [];
  filteredUsers: any[] = [];
  userUid: any;
  selectedChat: any = null;
  mensajeCtrl = new FormControl('');
  chatId!: string;
  chatMessage$!: Observable<Message[]> | null;
  isModalOpen_ChatMessage = false; // Apertura del Modal ChatMessage
  constructor(
    private usuariosService: UsuarioServiceService,
    private chatService: ChatsService,
    public usersService: UsersService,
    private afAuth: AngularFireAuth
  ) {
    this.chats$ = this.chatService.get_Chats;
    this.obtenerId();
    
  }

  ngOnInit() {
    window.addEventListener('resize', () => {
      this.isDesktop = window.innerWidth > 768; // Actualiza el valor al cambiar el tamaño de la ventana
    });
  }

  obtenerId() {
    return this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userUid = user.uid;
      }
    });
  }

  crearChat(user: ProfileUser) {
    console.log(user.displayName);
    this.chatService.createChat(user);
    this.chats$ = this.chatService.get_Chats;
  }

  chatElegido(user: Chat,isOpen:boolean) {
    this.selectedUsuario = user;
    const name = user.ultimoMensaje;
    if(!this.isDesktop){
      this.setOpenModal_ChatMessage(isOpen);
    }
    console.log(name);
    this.fotoSelected != user.chatPic;
    this.nombreSelected != user.id;
    this.usersService.flagUserSelect=true;
    this.chatMessage$ = this.sortTimeMessage(this.selectedUsuario.id);
  }

  setOpenModal_ChatMessage(isOpen: boolean) {
    this.isModalOpen_ChatMessage = isOpen;
  }

  enviarMensaje() {
    const mensaje = this.mensajeCtrl.value;
    const chatId = this.selectedUsuario.id;
    if (mensaje) {
      this.chatService.create_MessageChats(chatId, mensaje);
      this.chats$ = this.chatService.get_Chats;
      this.chatMessage$ = this.sortTimeMessage(this.selectedUsuario.id);
      this.scrollChat();
      this.mensajeCtrl.setValue('');
    }
  }

  sortTimeMessage(chatId: string): Observable<Message[]> {
    return this.chatService
      .get_MessageChats(chatId)
      .pipe(
        map((array) =>
          array.sort((a, b) => a.sentDate.toMillis() - b.sentDate.toMillis())
        )
      );
  }

  scrollChat() {
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    },100);
  }
}

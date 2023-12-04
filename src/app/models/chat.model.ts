import { Timestamp } from '@angular/fire/firestore';
import { ProfileUser } from './user.model';

export interface Chat {
  id: string;
  ultimoMensaje?: string;
  ultimoMensajeTiempo?: Date & Timestamp;
  userIds: string[];
  users: ProfileUser[];

  // Not stored, only for display
  chatPic?: string;
  chatName?: string;
}

export interface Message {
  text: string;
  senderId: string;
  sentDate: Date & Timestamp;
}
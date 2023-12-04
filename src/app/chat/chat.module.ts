import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChatPageRoutingModule } from './chat-routing.module';
import { ChatPage } from './chat.page';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { OrderByFechaPipe } from './pipes/order-by-fecha.pipe';
import { DisplayFechaPipe } from './pipes/displayFecha/display-fecha.pipe';
import { DisplayHoraPipe } from './pipes/displayHora/display-hora.pipe';
import { AsideChatComponent } from './component/aside-chat/aside-chat.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    ReactiveFormsModule,
    // MATERIAL
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    MatListModule,
    
  ],
  declarations: [ChatPage, OrderByFechaPipe, DisplayFechaPipe, DisplayHoraPipe,AsideChatComponent]  // Elimina DateMessagePipe de aquí
})
export class ChatPageModule {}

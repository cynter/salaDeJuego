import { Component } from '@angular/core';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service'; // Asegúrate que tienes esto
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  messages$: Observable<ChatMessage[]>;
  newMessage = '';

  constructor(
    private chatService: ChatService,
    private auth: AuthService
  ) {
    this.messages$ = this.chatService.messages$;
  }

  async sendMessage() {
    const user = this.auth.currentUser; // Asegúrate de que este getter esté disponible

    if (!user || !user.id) {
      console.warn('No estás autenticado');
      return;
    }

    if (this.newMessage.trim()) {
      await this.chatService.sendMessage(this.newMessage, user.id);
      this.newMessage = '';
    }
  }
}

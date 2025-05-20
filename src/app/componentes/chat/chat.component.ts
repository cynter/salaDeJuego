import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
export class ChatComponent implements AfterViewInit {
  @ViewChild('messageList') messageList!: ElementRef
  messages$: Observable<ChatMessage[]>;
  newMessage = '';
  currentUserId: string | null = null;
  userColors = new Map<string, string>();
  colorPalette = ['#d32f2f', '#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#c2185b', '#0288d1', '#512da8', '#455a64'];

  constructor(
    private chatService: ChatService,
    public auth: AuthService
  ) {
    this.messages$ = this.chatService.messages$;
    const user = this.auth.currentUser;
    if (user) {
      this.currentUserId = user.id;
    }
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

  getUserColor(userId: string): string {
    if (!this.userColors.has(userId)) {
      const index = this.userColors.size % this.colorPalette.length;
      this.userColors.set(userId, this.colorPalette[index]);
    }
    return this.userColors.get(userId)!;
  }

  ngAfterViewInit() {
    this.messages$.subscribe(() => {
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    });
  }

  scrollToBottom() {
    try {
      const list = this.messageList.nativeElement;
      list.scrollTop = list.scrollHeight;
    } catch (err) {
      console.error('Error al hacer scroll:', err);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (event.ctrlKey || event.metaKey) {
        // Agregar salto de línea
        this.newMessage += '\n';
      } else {
        // Enviar mensaje
        event.preventDefault(); // Evita el salto de línea
        this.sendMessage();
      }
    }
  }
}

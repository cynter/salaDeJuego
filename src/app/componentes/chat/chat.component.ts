import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
//import { ChatDatePipe } from '../../pipes/chat-date.pipe';
//import { groupBy } from 'lodash'; // opcional si querés usar lodash
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { map } from 'rxjs/operators';
import { ChatTimePipe } from '../../pipes/chat-date.pipe';



@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, ChatTimePipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})

/*
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
    const user = this.auth.currentUser;

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
  */

export class ChatComponent implements AfterViewInit {
  @ViewChild('messageList') messageList!: ElementRef;

  /** Flujo crudo de mensajes (lo mantenemos para el auto-scroll) */
  messages$: Observable<ChatMessage[]> = new Observable();

  /** Mensajes agrupados →  [ ['Hoy', msgs[]], ['2 jun 2025', msgs[]] ] */
  groupedMessages$: Observable<[string, ChatMessage[]][]>;

  newMessage = '';
  currentUserId: string | null = null;

  /** Colores por usuario */
  private userColors = new Map<string, string>();
  private colorPalette = [
    '#d32f2f', '#1976d2', '#388e3c', '#f57c00',
    '#7b1fa2', '#c2185b', '#0288d1', '#512da8', '#455a64'
  ];

  constructor(
    private chatService: ChatService,
    public  auth: AuthService
  ) {
    // Agrupar los mensajes por fecha
    this.groupedMessages$ = this.chatService.messages$.pipe(
      map(messages => {
        const grouped: Record<string, ChatMessage[]> = {};

        messages.forEach(msg => {
          const date = parseISO(msg.created_at);
          let key: string;

          if (isToday(date))       key = 'Hoy';
          else if (isYesterday(date)) key = 'Ayer';
          else                      key = format(date, 'd MMM yyyy', { locale: es });

          (grouped[key] ||= []).push(msg);
        });

        // Convertimos en array para poder iterar en el template
        return Object.entries(grouped);
      })
    );

    this.messages$ = this.chatService.messages$;
    // Usuario actual
    const user = this.auth.currentUser;
    if (user) this.currentUserId = user.id;
  }

  /** Envía el mensaje al servicio */
  async sendMessage() {
    const user = this.auth.currentUser;
    if (!user?.id) {
      console.warn('No estás autenticado');
      return;
    }

    const trimmed = this.newMessage.trim();
    if (trimmed) {
      await this.chatService.sendMessage(trimmed, user.id);
      this.newMessage = '';
    }
  }

  /** Color único por usuario */
  getUserColor(userId: string): string {
    if (!this.userColors.has(userId)) {
      const idx = this.userColors.size % this.colorPalette.length;
      this.userColors.set(userId, this.colorPalette[idx]);
    }
    return this.userColors.get(userId)!;
  }

  /** Auto-scroll al recibir nuevos mensajes */
  ngAfterViewInit() {
    this.messages$.subscribe(() => {
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  private scrollToBottom() {
    try {
      const list = this.messageList.nativeElement;
      list.scrollTop = list.scrollHeight;
    } catch (err) {
      console.error('Error al hacer scroll:', err);
    }
  }

  /** Ctrl+Enter → salto de línea, Enter → enviar */
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (event.ctrlKey || event.metaKey) {
        this.newMessage += '\n';
      } else {
        event.preventDefault();
        this.sendMessage();
      }
    }
  }
}

import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  id: number;
  user_id: string;
  content: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private supabase: SupabaseClient;
  private _messages = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this._messages.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.fetchMessages();
    this.listenForNewMessages();
  }

  private async fetchMessages() {
    const { data, error } = await this.supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      this._messages.next(data as ChatMessage[]);
    } else {
      console.error('Error fetching messages:', error);
    }
  }

  private listenForNewMessages() {
    this.supabase
      .channel('chat_messages_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          const current = this._messages.value;
          this._messages.next([...current, newMessage]);
        }
      )
      .subscribe();
  }

  async sendMessage(content: string, userId: string) {
    const { error } = await this.supabase.from('chat_messages').insert([
      { content, user_id: userId }
    ]);

    if (error) {
      console.error('Error sending message:', error);
    }
  }
}
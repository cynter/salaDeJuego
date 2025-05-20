import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private _user = new BehaviorSubject<User | null>(null);
  public user$ = this._user.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.loadUser();
  }

  // Método llamado al inicio para cargar el usuario actual
  private async loadUser() {
    // Escuchar cambios en la sesión
    this.supabase.auth.onAuthStateChange((event, session) => {
      this._user.next(session?.user || null);
    });

    const {
      data: { session }
    } = await this.supabase.auth.getSession();

    this._user.next(session?.user || null);
  }

  get currentUser(): User | null {
    return this._user.value;
  }

  async signOut() {
    await this.supabase.auth.signOut();
  }
}
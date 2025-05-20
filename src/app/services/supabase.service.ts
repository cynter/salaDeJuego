import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  //private supabase: SupabaseClient;
  public supabase: SupabaseClient;
  private currentUser: User | null = null;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    this.supabase.auth.getUser().then(({ data }) => {
      this.currentUser = data?.user ?? null;
    });

    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser = session?.user ?? null;
    });
  }

  get user() {
    return this.currentUser;
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    await this.logLogin(data.user);
    return data.user;
  }

  async register(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;

    if (!data.user || !data.user.identities || data.user.identities.length === 0) {
      throw new Error('User already registered');
    }
    
    return data.user;
  }

  async logLogin(user: User) {
    await this.supabase.from('logs').insert({
      email: user.email,
      fecha: new Date().toISOString(),
    });
  }

  async logout() {
    await this.supabase.auth.signOut();
  }

  //Guardar encuesta
  insertarEncuesta(data: any) {
    return this.supabase.from('encuestas').insert(data);
  }
}
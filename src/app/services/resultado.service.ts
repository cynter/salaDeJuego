import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultadoService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async guardarResultado(juego: string, puntos: number, palabra: string, gano: boolean) {
    const {
      data: { user },
      error: userError
    } = await this.supabase.auth.getUser();

    if (userError || !user) {
      console.error('No se pudo obtener el usuario:', userError);
      return;
    }

    const { data, error } = await this.supabase.from('resultados').insert([
      {
        juego,
        puntos,
        palabra,
        gano,
        user_id: user.id,
        //fecha: new Date().toISOString()
      }
    ]);

    if (error) console.error('Error guardando resultado:', error);
    else console.log('Resultado guardado:', data);
  }

  async obtenerResultadosDelUsuario() {
    const {
      data: { user },
      error: userError
    } = await this.supabase.auth.getUser();

    if (userError || !user) {
      console.error('No se pudo obtener el usuario:', userError);
      return [];
    }

    const { data, error } = await this.supabase
      .from('resultados')
      .select('*')
      .eq('user_id', user.id)
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error obteniendo resultados:', error);
      return [];
    }

    return data;
  }
}

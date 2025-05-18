import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {

  juegos = [
    {
      nombre: 'Ahorcado',
      ruta: 'juegos/ahorcado',
      imagen: 'assets/ahorcado.png'
    },
    {
      nombre: 'Mayor o Menor',
      ruta: 'juegos/mayor-menor',
      imagen: 'assets/mayor-menor.png'
    },
    {
      nombre: 'Preguntados',
      ruta: 'juegos/preguntados',
      imagen: 'assets/preguntados.png'
    },
    {
      nombre: 'Adivina la casa',
      ruta: 'juegos/mi-juego',
      imagen: 'assets/mi-juego.png'
    }
  ];

  constructor(public supabase: SupabaseService, private router: Router) {}

  logout() {
    this.supabase.logout();
  }

  irAJuego(ruta: string) {
    this.router.navigate([ruta]);
  }
}
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GotService } from '../../../services/got.service';
import { Personaje } from '../../../models/personaje.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mi-juego',
  imports: [CommonModule],
  templateUrl: './mi-juego.component.html',
  styleUrl: './mi-juego.component.scss'
})
export class MiJuegoComponent implements OnInit, OnDestroy {
  personajes: Personaje[] = [];
  personajeActual!: Personaje;
  opciones: string[] = [];
  esCorrecta = false;
  respuestaMostrada = false;
  subscripcion!: Subscription;
  puntaje: number = 0;
  totalPreguntas: number = 0;

  constructor(private gotService: GotService) {}

  ngOnInit(): void {
    this.getPersonajes();
  }

  ngOnDestroy(): void {
    this.subscripcion?.unsubscribe();
  }

  getPersonajes() {
    this.subscripcion = this.gotService.getPersonajes().subscribe({
      next: (data: Personaje[]) => {
        this.personajes = data.filter(p => p.family); // asegurarse que tenga familia
        this.cargarNuevoReto();
      },
      error: (error) => console.error('Error al obtener los personajes', error),
    });
  }

  cargarNuevoReto() {
    const indice = Math.floor(Math.random() * this.personajes.length);
    this.personajeActual = this.personajes[indice];

    // Generar opciones (incluye la correcta + otras aleatorias)
    const opcionesSet = new Set<string>();
    opcionesSet.add(this.personajeActual.family);

    while (opcionesSet.size < 4) {
      const randomFam = this.personajes[Math.floor(Math.random() * this.personajes.length)].family;
      opcionesSet.add(randomFam);
    }

    // Mezclar opciones
    this.opciones = Array.from(opcionesSet).sort(() => Math.random() - 0.5);
    this.respuestaMostrada = false;
  }

  verificarRespuesta(opcion: string) {
    this.esCorrecta = opcion === this.personajeActual.family;
    this.respuestaMostrada = true;
    this.totalPreguntas++;

    if (this.esCorrecta) {
      this.puntaje += 1;
    } else {
      this.puntaje -= 1; // opcional: penalización
    }
  }


  siguiente() {
    this.cargarNuevoReto();
  }

}

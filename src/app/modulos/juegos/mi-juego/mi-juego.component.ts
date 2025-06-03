import { Component, OnDestroy, OnInit } from '@angular/core';
import { GotService } from '../../../services/got.service';
import { Personaje } from '../../../models/personaje.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ResultadoService } from '../../../services/resultado.service';

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

  intentosRestantes: number = 3;
  //juegoTerminado: boolean = false;
  juegoTerminado = false;
  gano = false;
  mensajeFinal: string = '';

  constructor(private gotService: GotService, private resultadoService: ResultadoService) { }

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
        this.reiniciarJuego();
      },
      error: (error) => console.error('Error al obtener los personajes', error),
    });
  }

  cargarNuevoReto() {
    if (this.juegoTerminado) return;

    const indice = Math.floor(Math.random() * this.personajes.length);
    this.personajeActual = this.personajes[indice];

    // Generar opciones (incluye la correcta + otras aleatorias)
    const opcionesSet = new Set<string>();
    opcionesSet.add(this.personajeActual.family);

    while (opcionesSet.size < 3) {
      const randomFam = this.personajes[Math.floor(Math.random() * this.personajes.length)].family;
      opcionesSet.add(randomFam);
    }

    // Mezclar opciones
    this.opciones = Array.from(opcionesSet).sort(() => Math.random() - 0.5);
    this.respuestaMostrada = false;
    this.esCorrecta = false;
  }

  async verificarRespuesta(opcion: string) {
  if (this.juegoTerminado) return;

  this.esCorrecta = opcion === this.personajeActual.family;
  this.respuestaMostrada = true;
  this.totalPreguntas++;

  if (this.esCorrecta) {
    this.puntaje++;
    if (this.puntaje >= 5) {
      this.juegoTerminado = true;
      this.gano = true;
      this.mensajeFinal = `🎉 ¡Ganaste! Puntuación final: ${this.puntaje}`;
      await this.guardarResultado(true);
      return;
    }
  } else {
    this.intentosRestantes--;
    if (this.intentosRestantes <= 0) {
      this.juegoTerminado = true;
      this.gano = false;
      this.mensajeFinal = `😞 Juego terminado. Puntuación final: ${this.puntaje}`;
      await this.guardarResultado(false);
      return;
    }
  }
}


  siguiente() {
    if (!this.juegoTerminado) {
      this.cargarNuevoReto();
    }
  }

  async guardarResultado(gano: boolean) {
    try {
      await this.resultadoService.guardarResultado(
        'MiJuego',
        this.puntaje,
        this.personajeActual.family,
        gano
      );
      console.log('Resultado guardado');
    } catch (error) {
      console.error('Error guardando resultado:', error);
    }
  }

  reiniciarJuego() {
    this.puntaje = 0;
    this.totalPreguntas = 0;
    this.intentosRestantes = 3;
    this.juegoTerminado = false;
    this.mensajeFinal = '';
    this.cargarNuevoReto();
  }
}

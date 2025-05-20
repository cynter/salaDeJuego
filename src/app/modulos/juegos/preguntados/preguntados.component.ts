import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PaisesService } from '../../../services/paises.service';
import { ResultadoService } from '../../../services/resultado.service';
import { Pais } from '../../../models/pais.model';

@Component({
  selector: 'app-preguntados',
  imports: [CommonModule],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.scss'
})
export class PreguntadosComponent implements OnInit, OnDestroy {
  paises: Pais[] = [];
  subscripcion!: Subscription;

  banderaActual: Pais | null = null;
  opciones: string[] = [];
  respuestaCorrecta: string = '';
  mensaje: string = '';
  puntuacion: number = 0;
  intentosRestantes: number = 3;
  esCorrecta: boolean = false;

  constructor(
    private paisesService: PaisesService,
    private resultadoService: ResultadoService
  ) { }

  ngOnInit(): void {
    this.getPaises();
  }

  ngOnDestroy(): void {
    this.subscripcion?.unsubscribe();
  }

  getPaises() {
    this.subscripcion = this.paisesService.getPaises()
      .subscribe({
        next: (data: Pais[]) => {
          this.paises = data;
          this.getNuevaPregunta();
        },
        error: (error) => {
          console.error('Error al obtener el pais', error);
        }
      });
  }

  getNuevaPregunta() {
    if (this.paises.length < 4) return;

    const paisCorrecto = this.paises[Math.floor(Math.random() * this.paises.length)];
    this.banderaActual = paisCorrecto;
    this.respuestaCorrecta = paisCorrecto.name;

    const opcionesIncorrectas = this.paises
      .filter(p => p.name !== paisCorrecto.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(p => p.name);

    this.opciones = [...opcionesIncorrectas, paisCorrecto.name].sort(() => 0.5 - Math.random());
    this.mensaje = '';
  }

  async seleccionarOpcion(opcion: string) {
    this.esCorrecta = opcion === this.respuestaCorrecta;

    if (this.esCorrecta) {
      this.puntuacion++;

      if (this.puntuacion >= 5) {
        // El jugador ganó porque llegó a 5 puntos
        await this.resultadoService.guardarResultado(
          'Preguntados',
          this.puntuacion,
          this.respuestaCorrecta,
          true  // ganó
        );

        this.mensaje = `🎉 ¡Ganaste! Puntuación final: ${this.puntuacion}`;
        this.opciones = [];
        this.banderaActual = null;
        return;
      }

      this.mensaje = '¡Correcto!';
    } else {
      this.intentosRestantes--;

      if (this.intentosRestantes <= 0) {
        // El jugador perdió porque se acabaron los intentos
        await this.resultadoService.guardarResultado(
          'Preguntados',
          this.puntuacion,
          this.respuestaCorrecta,
          false  // perdió
        );

        this.mensaje = `😞 Juego terminado. Puntuación final: ${this.puntuacion}`;
        this.opciones = [];
        this.banderaActual = null;
        return;
      }

      this.mensaje = `Incorrecto. Era: ${this.respuestaCorrecta}`;
    }

    // Si no terminó el juego, continuar con la siguiente pregunta
    setTimeout(() => this.getNuevaPregunta(), 1500);
  }


  reiniciarJuego() {
    this.puntuacion = 0;
    this.intentosRestantes = 3;
    this.mensaje = '';
    this.banderaActual = null;
    this.opciones = [];
    this.respuestaCorrecta = '';
    this.esCorrecta = false;
    this.getNuevaPregunta();
  }

}

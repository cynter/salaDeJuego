import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PaisesService } from '../../../services/paises.service';
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

  esCorrecta: boolean = false;

  constructor(private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.getPaises();
  }

  ngOnDestroy(): void {
    this.subscripcion?.unsubscribe();
  }

  getPaises() {
    this.subscripcion = this.paisesService.getPaises()
      .subscribe(
        {
          next: (data: Pais[]) => {
            this.paises = data;
            this.getNuevaPregunta();
          },
          error: (error) => {
            console.error('Error al obtener el pais', error);
          },
          complete: () => {
            console.log('Petición completada');
          }

        }
      );
  }

  getNuevaPregunta() {
    if (this.paises.length < 4) return;

    // Seleccionar país correcto al azar
    const paisCorrecto = this.paises[Math.floor(Math.random() * this.paises.length)];
    this.banderaActual = paisCorrecto;
    this.respuestaCorrecta = paisCorrecto.name;

    // Generar 3 opciones incorrectas
    const opcionesIncorrectas = this.paises
      .filter(p => p.name !== paisCorrecto.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(p => p.name);

    // Unir y mezclar
    this.opciones = [...opcionesIncorrectas, paisCorrecto.name].sort(() => 0.5 - Math.random());
    this.mensaje = '';
  }

  seleccionarOpcion(opcion: string) {
    this.esCorrecta = opcion === this.respuestaCorrecta;

    if (this.esCorrecta) {
      this.mensaje = '¡Correcto!';
      this.puntuacion++;
    } else {
      this.mensaje = `Incorrecto. Era: ${this.respuestaCorrecta}`;
    }

    setTimeout(() => this.getNuevaPregunta(), 1500);
  }

}

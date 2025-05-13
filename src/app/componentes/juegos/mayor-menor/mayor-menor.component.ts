import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mayor-menor',
  imports: [CommonModule],
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.scss'
})
export class MayorMenorComponent {
  cartaActual: number = this.obtenerCarta();
  siguienteCarta: number = 0;
  puntaje: number = 0;
  juegoTerminado: boolean = false;

  obtenerCarta(): number {
    return Math.floor(Math.random() * 13) + 1; // 1 a 13
  }

  jugar(eleccion: 'mayor' | 'menor') {
    this.siguienteCarta = this.obtenerCarta();

    const gano =
      (eleccion === 'mayor' && this.siguienteCarta > this.cartaActual) ||
      (eleccion === 'menor' && this.siguienteCarta < this.cartaActual);

    if (gano) {
      this.puntaje++;
      this.cartaActual = this.siguienteCarta;
      this.siguienteCarta = 0;
    } else {
      this.juegoTerminado = true;
    }
  }

  reiniciarJuego() {
    this.puntaje = 0;
    this.juegoTerminado = false;
    this.cartaActual = this.obtenerCarta();
    this.siguienteCarta = 0;
  }
}

import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-mayor-menor',
  standalone: false,
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.scss'
})
export class MayorMenorComponent implements OnDestroy{

  cartaActual: number = this.obtenerCarta();
  siguienteCarta: number = 0;
  cartaEnAnimacion: number = 1;

  puntaje: number = 0;
  juegoTerminado: boolean = false;

  intervaloAnimacion: any;

  flipping: boolean = false;

  obtenerCarta(): number {
    return Math.floor(Math.random() * 13) + 1; // 1 a 13
  }

  iniciarAnimacion() {
    this.intervaloAnimacion = setInterval(() => {
      this.cartaEnAnimacion = this.obtenerCarta();
    }, 100); // cambia cada 100ms
  }

  detenerAnimacion() {
    clearInterval(this.intervaloAnimacion);
  }

  jugar(eleccion: 'mayor' | 'menor' | 'igual') {
  this.detenerAnimacion();
  this.flipping = true; // activa animación

  // Esperamos la duración de la animación antes de mostrar el resultado
  setTimeout(() => {
    this.siguienteCarta = this.cartaEnAnimacion;

    const gano =
      (eleccion === 'mayor' && this.siguienteCarta > this.cartaActual) ||
      (eleccion === 'menor' && this.siguienteCarta < this.cartaActual) ||
      (eleccion === 'igual' && this.siguienteCarta == this.cartaActual);

    this.flipping = false; // termina animación

    if (gano) {
      this.puntaje++;
      this.cartaActual = this.siguienteCarta;
      this.siguienteCarta = 0;
      this.iniciarAnimacion(); // continuar
    } else {
      this.juegoTerminado = true;
    }
  }, 500); // duración del giro (debe coincidir con el CSS)
}

  reiniciarJuego() {
    this.puntaje = 0;
    this.juegoTerminado = false;
    this.cartaActual = this.obtenerCarta();
    this.siguienteCarta = 0;
    this.iniciarAnimacion();
  }

  ngOnDestroy(): void {
    this.detenerAnimacion();
  }

  ngOnInit(): void {
    this.iniciarAnimacion();
  }
}
import { Component, OnDestroy } from '@angular/core';
import { ResultadoService } from '../../../services/resultado.service';

@Component({
  selector: 'app-mayor-menor',
  standalone: false,
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.scss'
})
export class MayorMenorComponent implements OnDestroy {

  constructor(private resultadoService: ResultadoService) {}

  cartaActual = this.obtenerCarta();
  siguienteCarta = 0;            // valor oculto hasta el giro
  puntaje     = 0;
  juegoTerminado = false;
  flipping = false;              // controla la animación

  /** Devuelve un número de 1 a 13 */
  obtenerCarta(): number {
    return Math.floor(Math.random() * 13) + 1;
  }

  /** Prepara la ronda: genera la nueva carta oculta */
  prepararNuevaRonda() {
    this.siguienteCarta = this.obtenerCarta();
    this.flipping = false;       // deja la carta boca-abajo
  }

  ngOnInit(): void {
    this.prepararNuevaRonda();
  }

  ngOnDestroy(): void { /* sin temporizadores ahora */ }

  jugar(eleccion: 'mayor' | 'menor' | 'igual') {
    // impide clics repetidos
    if (this.flipping || this.juegoTerminado) return;

    this.flipping = true;        // activa el giro

    // espera al final de la animación (coincidir con el CSS → 500 ms)
    setTimeout(() => {

      // ya se ve la carta frontal, podemos evaluar
      const gano =
        (eleccion === 'mayor' && this.siguienteCarta >  this.cartaActual) ||
        (eleccion === 'menor' && this.siguienteCarta <  this.cartaActual) ||
        (eleccion === 'igual' && this.siguienteCarta === this.cartaActual);

      if (gano) {
        this.puntaje++;

        if (this.puntaje >= 5) {
          this.finalizarJuego(true);           // llegó a 5 ⇒ gana
        } else {
          this.cartaActual = this.siguienteCarta;  // la carta revelada pasa a ser la actual
          this.prepararNuevaRonda();               // nueva ronda
        }
      } else {
        this.finalizarJuego(false);            // pierde
      }

    }, 500);                                   // duración del flip
  }

  reiniciarJuego() {
    this.puntaje = 0;
    this.juegoTerminado = false;
    this.cartaActual = this.obtenerCarta();
    this.prepararNuevaRonda();
  }

  finalizarJuego(gano: boolean) {
    this.juegoTerminado = true;
    this.resultadoService.guardarResultado(
      'Mayor o Menor',
      this.puntaje,
      '',        // sin palabra
      gano
    );
  }
}

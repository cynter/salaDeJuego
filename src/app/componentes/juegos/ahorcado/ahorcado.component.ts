import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ahorcado',
  imports: [CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.scss'
})
export class AhorcadoComponent {
  
  palabras: string[] = ['ANGULAR', 'TYPESCRIPT', 'COMPONENTE', 'SERVICIO', 'RUTA'];
  palabra: string = this.elegirPalabra();
  letrasAdivinadas: string[] = [];
  intentos = 6;

  letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

  seleccionarLetra(letra: string) {
    if (this.letrasAdivinadas.includes(letra) || this.juegoTerminado) return;
    this.letrasAdivinadas.push(letra);
    if (!this.palabra.includes(letra)) this.intentos--;
  }

  mostrarLetra(letra: string): string {
    return this.letrasAdivinadas.includes(letra) ? letra : '_';
  }

  get juegoTerminado(): boolean {
    return this.intentos === 0 || this.gano;
  }
  
  get gano(): boolean {
    return this.palabra.split('').every(letra => this.letrasAdivinadas.includes(letra));
  }
  
  get perdio(): boolean {
    return this.intentos === 0 && !this.gano;
  }

  reiniciarJuego() {
    this.intentos = 6;
    this.letrasAdivinadas = [];
    this.palabra = this.elegirPalabra();
  }

  elegirPalabra(): string {
    const index = Math.floor(Math.random() * this.palabras.length);
    return this.palabras[index];
  }

}

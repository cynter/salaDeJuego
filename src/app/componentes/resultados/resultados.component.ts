import { Component, OnInit } from '@angular/core';
import { ResultadoService } from '../../services/resultado.service';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-resultados',
  imports: [CommonModule, NgClass],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.scss'
})
export class ResultadosComponent implements OnInit {

  resultados: any[] = [];
  cargando = true;

  constructor(private resultadoService: ResultadoService) { }

  async ngOnInit() {
    this.resultados = await this.resultadoService.obtenerResultadosDelUsuario();
    this.cargando = false;
  }

}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AhorcadoComponent } from './ahorcado/ahorcado.component';
import { MayorMenorComponent } from './mayor-menor/mayor-menor.component';

const routes: Routes = [
  // este es el que se usa para lazy loading con el modulo y el componente standalone false
  {
    path: 'ahorcado',
    component: AhorcadoComponent,
  },
  {
    path: 'mayor-menor',
    component: MayorMenorComponent,
  },
  // este es el que se usa para lazy loading con el modulo y el componente standalone true
  {
    path:'preguntados',
    loadComponent: () => import('./preguntados/preguntados.component').then(m => m.PreguntadosComponent),
  },
  {
    path: 'mi-juego',
    loadComponent: () => import('./mi-juego/mi-juego.component').then(m => m.MiJuegoComponent),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuegosRoutingModule { }

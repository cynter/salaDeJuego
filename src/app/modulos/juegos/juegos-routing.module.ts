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
  /* este seria si el componente es standalone
  // este es el que se usa para lazy loading
  {
  path: 'ahorcado',
  loadComponent: () =>
    import('./ahorcado/ahorcado.component').then((m) => m.AhorcadoComponent),
  }
  */
  {
    path: 'mayor-menor',
    component: MayorMenorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuegosRoutingModule { }

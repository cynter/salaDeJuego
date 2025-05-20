import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { QuienSoyComponent } from './componentes/quien-soy/quien-soy.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { ChatComponent } from './componentes/chat/chat.component';
import { AuthGuard } from './auth/auth.guard';
import { EncuestaComponent } from './componentes/encuesta/encuesta.component';

export const routes: Routes = [

    { path: '', redirectTo: '/home', pathMatch: "full" },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'quien-soy', component: QuienSoyComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
    {
      path: 'juegos',
      loadChildren: () =>
        import('./modulos/juegos/juegos.module').then(m => m.JuegosModule)
    },
    { path: 'encuesta', component: EncuestaComponent },
    /*
    {
      //aca que use loadComponent y modulos
        path: 'ahorcado',
        loadChildren: () => import('./componentes/juegos/ahorcado/ahorcado.routes').then(
          m => m.AHORCADO_ROUTES)
    },
    {
      path: 'mayor-menor',
      loadChildren: () =>
        import('./componentes/juegos/mayor-menor/mayor-menor.routes').then(
          (m) => m.MAYOR_MENOR_ROUTES
        )
    }
    */
];

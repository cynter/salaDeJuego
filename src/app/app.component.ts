import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'saladejuegos';

  constructor(public auth: AuthService, private router: Router) {}

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/home']);
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})

export class RegistroComponent {
  email = '';
  password = '';
  errorMsg = '';
  successMsg = '';

  constructor(private supabase: SupabaseService, private router: Router) { }

  async register() {
    this.errorMsg = '';
    this.successMsg = '';

    try {
      const user = await this.supabase.register(this.email, this.password);
      this.successMsg = 'Registro exitoso. Revisa tu correo.';
      this.router.navigate(['/home']);
    } catch (error: any) {
      if (error.message.includes('User already registered')) {
        this.errorMsg = 'Este correo ya está registrado.';
      } else if (error.message.includes('Unable to validate email address: invalid format')) {
        this.errorMsg = 'Formato invalido de mail.';
      } else if (error.message.includes('Password should be at least 6 characters')) {
        this.errorMsg = 'La contraseña tiene que tener minimo 6 caracteres.';
      } else {
        this.errorMsg = 'Ocurrió un error: ' + error.message;
      }
    }
  }
}

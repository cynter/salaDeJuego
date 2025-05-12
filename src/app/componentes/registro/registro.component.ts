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

  constructor(private supabase: SupabaseService, private router: Router) {}

  async register() {
    try {
      await this.supabase.register(this.email, this.password);
      this.router.navigate(['/home']);
    } catch (err: any) {
      this.errorMsg = err.message;
    }
  }
}

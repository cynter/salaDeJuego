import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';

  constructor(private supabase: SupabaseService, private router: Router) {}

  async login() {
    try {
      await this.supabase.login(this.email, this.password);
      this.router.navigate(['/home']);
    } catch (err: any) {
      this.errorMsg = err.message;
    }
  }

  fillQuick(email: string, password: string) {
    this.email = email;
    this.password = password;
    this.login();
  }
}

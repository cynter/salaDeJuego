import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';


@Component({
  selector: 'app-encuesta',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.scss'
})
export class EncuestaComponent {

  encuestaForm: FormGroup;

  constructor(private fb: FormBuilder, private supabase: SupabaseService) {
    this.encuestaForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(98)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{1,10}$')]],
      pregunta1: ['', Validators.required], // radiobutton
      pregunta2: this.fb.group({
        opcion1: [false],
        opcion2: [false],
        opcion3: [false],
      }, { validators: this.alMenosUnaSeleccionada }),
      pregunta3: ['', Validators.required] // textbox
    });
  }

  alMenosUnaSeleccionada(group: FormGroup) {
    const seleccionadas = Object.values(group.controls).some(control => control.value);
    return seleccionadas ? null : { ningunaSeleccionada: true };
  }

 async onSubmit() {
  if (this.encuestaForm.valid) {
    const form = this.encuestaForm.value;

    // Convertimos checkboxes a array
    const juegos: string[] = [];
    if (form.pregunta2.opcion1) juegos.push('Ahorcado');
    if (form.pregunta2.opcion2) juegos.push('Mayor-Menor-Igual');
    if (form.pregunta2.opcion3) juegos.push('Preguntados');
    if (form.pregunta2.opcion4) juegos.push('Adivina la casa');

    // Obtener usuario actual
    const {
      data: { user },
      error: userError
    } = await this.supabase.supabase.auth.getUser();

    if (userError || !user) {
      alert('No estás autenticado. Iniciá sesión para completar la encuesta.');
      return;
    }

    const encuesta = {
      user_id: user.id,
      nombre: form.nombre,
      apellido: form.apellido,
      edad: form.edad,
      telefono: form.telefono,
      pregunta1: form.pregunta1,
      juegos_preferidos: juegos,
      opinion: form.pregunta3
    };

    const { error } = await this.supabase.insertarEncuesta(encuesta);

    if (error) {
      console.error('Error al guardar en Supabase:', error.message);
      alert('Hubo un error al guardar la encuesta.');
    } else {
      alert('¡Encuesta enviada con éxito!');
      this.encuestaForm.reset();
    }
  } else {
    this.encuestaForm.markAllAsTouched();
  }
}

}

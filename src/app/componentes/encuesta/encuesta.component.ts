import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-encuesta',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})

export class EncuestaComponent {

  encuestaForm: FormGroup;

  // feedback visual
  mensaje: string | null = null;
  tipoMensaje: 'exito' | 'error' | null = null;

  constructor(private fb: FormBuilder,
    private supabase: SupabaseService) {

    this.encuestaForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(98)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{1,10}$')]],
      pregunta1: ['', Validators.required],   // radio
      pregunta2: this.fb.group({              // checkboxes
        opcion1: [false],
        opcion2: [false],
        opcion3: [false],
        opcion4: [false],
      }, { validators: this.alMenosUnaSeleccionada }),
      pregunta3: ['', Validators.required]    // textarea
    });
  }

  /** Validator: al menos un checkbox marcado */
  alMenosUnaSeleccionada(group: FormGroup) {
    const alguna = Object.values(group.controls).some(ctrl => ctrl.value);
    return alguna ? null : { ningunaSeleccionada: true };
  }

  /** Muestra mensaje con animación y lo cierra a los 4 s */
  mostrarMensaje(txt: string, tipo: 'exito' | 'error') {
    this.mensaje = txt;
    this.tipoMensaje = tipo;

    // ⬆️ Scroll automático al top de la pantalla
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      this.mensaje = null;
      this.tipoMensaje = null;
    }, 4000);
  }

  /** Envío de formulario */
  async onSubmit() {

    if (!this.encuestaForm.valid) {
      this.encuestaForm.markAllAsTouched();
      return;
    }

    const form = this.encuestaForm.value;

    // checkboxes → array
    const juegos: string[] = [];
    if (form.pregunta2.opcion1) juegos.push('Ahorcado');
    if (form.pregunta2.opcion2) juegos.push('Mayor-Menor-Igual');
    if (form.pregunta2.opcion3) juegos.push('Preguntados');
    if (form.pregunta2.opcion4) juegos.push('Adivina la casa');

    // usuario actual Supabase
    const { data: { user }, error: userError } =
      await this.supabase.supabase.auth.getUser();

    if (userError || !user) {
      this.mostrarMensaje('No estás autenticado. Iniciá sesión para completar la encuesta.', 'error');
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
      console.error('Error Supabase:', error.message);
      this.mostrarMensaje('Hubo un error al guardar la encuesta.', 'error');
    } else {
      this.mostrarMensaje('¡Encuesta enviada con éxito!', 'exito');
      this.encuestaForm.reset();
    }
  }
}

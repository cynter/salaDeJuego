import { Pipe, PipeTransform } from '@angular/core';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

@Pipe({
  name: 'chatTime',
  standalone: true
})
export class ChatTimePipe implements PipeTransform {
  transform(value: string): string {
    return format(parseISO(value), 'HH:mm', { locale: es });
  }
}

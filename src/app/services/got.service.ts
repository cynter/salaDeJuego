import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Personaje } from '../models/personaje.model';

@Injectable({
  providedIn: 'root'
})
export class GotService {

  constructor(private http: HttpClient) { }

  getPersonajes() {

    return this.http.get<Personaje[]>('https://thronesapi.com/api/v2/Characters')

  }
}

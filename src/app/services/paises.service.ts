import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pais } from '../models/pais.model';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  constructor(private http: HttpClient) { }

  getPaises() {
  
      return this.http.get<Pais[]>('https://restcountries.com/v2/all')
  
    }
}

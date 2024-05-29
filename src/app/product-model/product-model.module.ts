import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: []  // Esportalo se vuoi usarlo in altri moduli
})

export class ProductModule { }

export interface Prodotto {
  id: number;
  nome: string;
  marca: string;
  categoria: string;
  prezzo: number;
  immagine : string;
  descrizione : string;
  data_messa_in_vendita: Date;
}

export interface User{
  id: number;
  tipo: string;
  nome: string;
  cognome: string;
  username: string;
  email: string;
  password: string;
  token: string;
}
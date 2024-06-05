import { NgModule } from '@angular/core';  // Importa NgModule dal core di Angular
import { CommonModule } from '@angular/common';  // Importa CommonModule dal pacchetto comune di Angular

@NgModule({
  declarations: [],  // Dichiarazioni di componenti, direttive e pipe
  imports: [CommonModule],  // Moduli importati
  exports: []  // Esportazioni di componenti, direttive, pipe o moduli per l'uso in altri moduli
})
export class ProductModule { }  // Definisce un modulo chiamato ProductModule

// Interfaccia che descrive la struttura di un oggetto Prodotto
export interface Prodotto {
  id: number;  // ID univoco del prodotto
  nome: string;  // Nome del prodotto
  marca: string;  // Marca del prodotto
  categoria: string;  // Categoria del prodotto
  prezzo: number;  // Prezzo del prodotto
  immagine: string;  // Percorso dell'immagine del prodotto
  descrizione: string;  // Descrizione del prodotto
  data_messa_in_vendita: Date;  // Data di messa in vendita del prodotto
}

// Interfaccia che descrive la struttura di un oggetto User
export interface User {
  id: number;  // ID univoco dell'utente
  tipo: string;  // Tipo di utente (Admin, User, ecc.)
  nome: string;  // Nome dell'utente
  cognome: string;  // Cognome dell'utente
  username: string;  // Nome utente
  email: string;  // Email dell'utente
  password: string;  // Password dell'utente
  token: string;  // Token di autenticazione
}


// Imports:

// NgModule: Decoratore che segnala che la classe successiva è un modulo Angular.
// CommonModule: Modulo che fornisce direttive comuni come ngIf e ngFor.
// NgModule:

// declarations: Utilizzato per dichiarare componenti, direttive e pipe che appartengono a questo modulo.
// imports: Elenca i moduli di cui questo modulo ha bisogno.
// exports: Utilizzato per esportare componenti, direttive, pipe o moduli in modo che possano essere utilizzati in altri moduli.
// ProductModule:
// Una classe che rappresenta un modulo Angular chiamato ProductModule. Attualmente non dichiara né esporta alcun componente, direttiva o pipe.

// Interfacce:
// Prodotto: Descrive la struttura degli oggetti prodotto con proprietà come id, nome, marca, categoria, prezzo, immagine, descrizione e data_messa_in_vendita.
// User: Descrive la struttura degli oggetti utente con proprietà come id, tipo, nome, cognome, username, email, password e token.
import { ApplicationConfig } from '@angular/core'; // Importa ApplicationConfig dal core di Angular
import { provideRouter } from '@angular/router'; // Importa provideRouter dal modulo router di Angular

import { routes } from './app.routes'; // Importa le rotte dall'archivio app.routes

// Definisce la configurazione dell'applicazione
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)] // Configura il provider del router con le rotte definite
};


// Importazioni:

// ApplicationConfig: Un'interfaccia che definisce la configurazione dell'applicazione.
// provideRouter: Una funzione che fornisce il router configurato con le rotte specificate.
// routes: Un file che contiene la definizione delle rotte dell'applicazione.
// Configurazione dell'Applicazione:

// Viene esportata una costante appConfig che rappresenta la configurazione dell'applicazione.
// providers: Un array di provider che viene utilizzato per configurare i servizi dell'applicazione.
// provideRouter(routes): Fornisce il router configurato con le rotte definite nell'array routes.
// Dettagli:
// ApplicationConfig:

// ApplicationConfig è un'interfaccia di Angular che permette di configurare l'applicazione a livello globale.
// Contiene diverse proprietà, ma in questo caso, stiamo configurando solo i providers.
// provideRouter:

// provideRouter è una funzione che accetta un array di rotte e restituisce un provider configurato per il router di Angular.
// Questo permette di configurare facilmente il router utilizzando un'API fluida e concisa.
// routes:

// routes è un array che definisce tutte le rotte dell'applicazione.
// Ogni rotta è un oggetto che specifica il percorso, il componente da rendere e altre opzioni di configurazione della rotta.
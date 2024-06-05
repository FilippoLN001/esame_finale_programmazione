// Importa il modulo 'platformBrowserDynamic' dal pacchetto '@angular/platform-browser-dynamic'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// Importa il modulo principale dell'applicazione 'AppModule' dal percorso relativo './app/app/app.module'
import { AppModule } from './app/app/app.module';

// Avvia l'applicazione Angular usando la piattaforma dinamica del browser e il modulo principale 'AppModule'
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err)); // Gestisce eventuali errori che si verificano durante l'avvio e li stampa sulla console


  // Importazioni:

  // platformBrowserDynamic: Importato dal pacchetto '@angular/platform-browser-dynamic', viene utilizzato per avviare un'applicazione Angular in un ambiente di browser dinamico.
  // AppModule: Importato dal percorso relativo './app/app/app.module', rappresenta il modulo principale dell'applicazione Angular.
  // Avvio dell'Applicazione:
  
  // platformBrowserDynamic().bootstrapModule(AppModule): Questo metodo avvia l'applicazione Angular usando il modulo specificato (AppModule).
  // platformBrowserDynamic(): Crea una piattaforma dinamica per eseguire l'applicazione nel browser.
  // bootstrapModule(AppModule): Avvia l'applicazione usando il modulo AppModule.
  // Gestione degli Errori:
  
  // .catch(err => console.error(err)): Aggiunge un gestore di errori che cattura eventuali errori che si verificano durante l'avvio dell'applicazione e li stampa sulla console usando console.error(err)

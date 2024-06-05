import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
// L'AuthInterceptor serve per gestire automaticamente l'aggiunta del token di autenticazione a tutte le richieste HTTP inviate dall'applicazione.
// Questo è utile in un'applicazione che utilizza autenticazione basata su token, come JSON Web Tokens (JWT)
// ,per garantire che ogni richiesta fatta a un'API protetta includa il token di autenticazione nel suo header.
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Verifica se l'utente è loggato
    if (this.authService.isLoggedIn()) {
      const token = this.authService.getToken(); // Ottiene il token solo se loggato
      // Clona la richiesta e aggiunge l'header di autorizzazione
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    // Passa la richiesta al prossimo handler della catena
    return next.handle(request);
  }
}


// import: Importa le dipendenze necessarie da Angular core e Angular HTTP.

// HttpRequest: Rappresenta una richiesta HTTP.
// HttpHandler: Gestisce le richieste HTTP.
// HttpEvent: Rappresenta un evento HTTP.
// HttpInterceptor: Interfaccia che un intercettore HTTP deve implementare.
// Observable: Tipo di dato utilizzato per gestire eventi asincroni.
// AuthService: Servizio di autenticazione per ottenere lo stato di login e il token.
// @Injectable: Decoratore che indica che il servizio può essere iniettato in altre classi.

// providedIn: 'root': Specifica che il servizio è disponibile in tutta l'applicazione (aggiunto implicitamente).
// AuthInterceptor: Classe che implementa l'interfaccia HttpInterceptor.

// constructor(private authService: AuthService): Costruttore che inietta il servizio di autenticazione (AuthService).
// intercept: Metodo che intercetta le richieste HTTP.

// request: HttpRequest<any>: La richiesta HTTP originale.
// next: HttpHandler: Il prossimo gestore della catena di richieste.
// if (this.authService.isLoggedIn()): Controlla se l'utente è loggato utilizzando il metodo isLoggedIn() del servizio di autenticazione. Se l'utente è loggato:
// const token = this.authService.getToken();: Ottiene il token dall'utente loggato.
// request = request.clone({ setHeaders: { Authorization: Bearer ${token} } });: Clona la richiesta originale e aggiunge l'header di autorizzazione con il token.
// return next.handle(request);: Passa la richiesta (eventualmente modificata) al prossimo gestore della catena di richieste.
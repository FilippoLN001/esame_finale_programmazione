import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Assicurati che il percorso sia corretto

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // Il costruttore inietta i servizi necessari: AuthService e Router
  constructor(private authService: AuthService, private router: Router) {}

  // Metodo canActivate, implementa l'interfaccia CanActivate
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Controlla se l'utente è loggato utilizzando il metodo isLoggedIn() del servizio AuthService
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']); // Se non è loggato, reindirizza alla pagina di login
      return false; // Impedisce l'accesso alla rotta protetta
    }

    // Verifica se la rotta richiede un ruolo specifico (ad esempio, 'Admin')
    if (route.data['role'] && this.authService.getRole() !== route.data['role']) {
      this.router.navigate(['/access-denied']); // Se l'utente non ha il ruolo richiesto, reindirizza alla pagina di accesso negato
      return false; // Impedisce l'accesso alla rotta protetta
    }

    // Se l'utente è loggato e ha il ruolo richiesto, consente l'accesso alla rotta
    return true;
  }
}

// import: Importa le dipendenze necessarie da Angular core e Angular router, oltre al servizio di autenticazione (AuthService).

// @Injectable: Decoratore che indica che il servizio può essere iniettato in altre classi.

// providedIn: 'root': Specifica che il servizio è disponibile in tutta l'applicazione.
// AuthGuard: Classe che implementa l'interfaccia CanActivate.

// constructor(private authService: AuthService, private router: Router): Costruttore che inietta il servizio di autenticazione (AuthService) e il router (Router).
// canActivate: Metodo che determina se una rotta può essere attivata.

// route: ActivatedRouteSnapshot: Istanza che contiene le informazioni sulla rotta attivata.
// state: RouterStateSnapshot: Istanza che contiene lo stato del router.
// if (!this.authService.isLoggedIn()): Controlla se l'utente è loggato utilizzando il metodo isLoggedIn() del servizio di autenticazione. Se non è loggato:
// this.router.navigate(['/login']);: Reindirizza l'utente alla pagina di login.
// return false;: Impedisce l'accesso alla rotta protetta.
// if (route.data['role'] && this.authService.getRole() !== route.data['role']): Controlla se la rotta richiede un ruolo specifico (definito nei dati della rotta) e se l'utente ha tale ruolo. Se l'utente non ha il ruolo richiesto:
// this.router.navigate(['/access-denied']);: Reindirizza l'utente alla pagina di accesso negato.
// return false;: Impedisce l'accesso alla rotta protetta.
// return true;: Se l'utente è loggato e ha il ruolo richiesto, consente l'accesso alla rotta.
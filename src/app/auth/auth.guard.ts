import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Assicurati che il percorso sia corretto

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']); // Reindirizza al login se non loggato
      return false;
    }

    // Verifica se l'utente è un Admin
    if (route.data['role'] && this.authService.getRole() !== route.data['role']) {
      this.router.navigate(['/access-denied']); // Reindirizza se l'utente non ha il ruolo richiesto | ricordati di cambiare la route
      return false;
    }

    return true;
  }
}

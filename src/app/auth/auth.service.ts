import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // URL base dell'API
  jwtHelper = new JwtHelperService(); // Utilità per lavorare con JWT

  // Oggetti BehaviorSubject per gestire gli stati di username e userId
  private usernameSubject = new BehaviorSubject<string>(this.getUsername() || '');
  private userIdSubject = new BehaviorSubject<number | null>(this.getUserId());

  constructor(private http: HttpClient, private router: Router) {}

  // Controlla se l'utente è loggato verificando se il token è presente e valido
  public isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token); // Forza il ritorno di un booleano
  }

  // Recupera il ruolo dell'utente dal token
  public getRole(): string {
    const token = this.getToken();
    if (!token) return '';

    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken ? decodedToken.role : '';
  }

  // Verifica se l'utente è un amministratore
  public isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }
  
  // Recupera il token dal localStorage
  public getToken(): string {
    return localStorage.getItem('token') || '';
  }

  // Esegue il logout rimuovendo le informazioni di autenticazione dal localStorage
  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    this.usernameSubject.next(''); // Resetta il subject dell'username
    this.userIdSubject.next(null); // Resetta il subject dell'userId
    this.router.navigate(['/login']); // Reindirizza alla pagina di login
  }

  // Recupera l'username dal localStorage
  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  // Recupera l'ID dell'utente dal localStorage
  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? +userId : null;
  }

  // Fornisce un Observable per l'username
  getUsernameObservable(): Observable<string> {
    return this.usernameSubject.asObservable();
  }

  // Fornisce un Observable per l'ID dell'utente
  getUserIdObservable(): Observable<number | null> {
    return this.userIdSubject.asObservable();
  }

  // Effettua il login e memorizza i dati di autenticazione nel localStorage
  login(email: string, password: string): void {
    this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .subscribe(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('userId', response.userId); // Salva l'ID dell'utente
        this.usernameSubject.next(response.username);
        this.userIdSubject.next(response.userId); // Aggiorna l'ID dell'utente
        this.router.navigate(['/dashboard']); // Reindirizza alla dashboard
      }, error => {
        console.error('Login failed', error);
      });
  }

  // Recupera i dettagli dell'utente dall'API usando l'ID dell'utente
  fetchUserDetails(): Observable<any> {
    const userId = this.getUserId();
    if (userId !== null) {
      return this.http.get<any>(`${this.apiUrl}/users/${userId}`);
    }
    return new Observable(observer => observer.error('User not logged in'));
  }
}
// Questo servizio di autenticazione (AuthService) gestisce le operazioni di login, logout, e il controllo dello stato di autenticazione dell'utente in un'applicazione Angular.
//  Utilizza JWT per la gestione dell'autenticazione e memorizza le informazioni dell'utente (come token, username e userId) nel localStorage.
//  Inoltre, fornisce metodi per recuperare e osservare queste informazioni in tutta l'applicazione, facilitando la gestione dell'accesso alle risorse protette
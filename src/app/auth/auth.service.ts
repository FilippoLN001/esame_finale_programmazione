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
  private apiUrl = 'http://localhost:3000';
  jwtHelper = new JwtHelperService();

  private usernameSubject = new BehaviorSubject<string>(this.getUsername() || '');
  private userIdSubject = new BehaviorSubject<number | null>(this.getUserId());

  constructor(private http: HttpClient, private router: Router) {}

  public isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token); // Forza il ritorno di un booleano
  }

  public getRole(): string {
    const token = this.getToken();
    if (!token) return '';

    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken ? decodedToken.role : '';
  }

  public isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }
  
  public getToken(): string {
    return localStorage.getItem('token') || '';
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    this.usernameSubject.next('');
    this.userIdSubject.next(null);
    this.router.navigate(['/login']);
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? +userId : null;
  }

  getUsernameObservable(): Observable<string> {
    return this.usernameSubject.asObservable();
  }

  getUserIdObservable(): Observable<number | null> {
    return this.userIdSubject.asObservable();
  }

  login(email: string, password: string): void {
    this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .subscribe(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('userId', response.userId); // Salva l'ID dell'utente
        this.usernameSubject.next(response.username);
        this.userIdSubject.next(response.userId); // Aggiorna l'ID dell'utente
        this.router.navigate(['/dashboard']);
      }, error => {
        console.error('Login failed', error);
      });
  }

  fetchUserDetails(): Observable<any> {
    const userId = this.getUserId();
    if (userId !== null) {
      return this.http.get<any>(`${this.apiUrl}/users/${userId}`);
    }
    return new Observable(observer => observer.error('User not logged in'));
  }
}



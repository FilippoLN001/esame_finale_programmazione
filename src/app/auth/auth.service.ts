import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  jwtHelper = new JwtHelperService();

  private usernameSubject = new BehaviorSubject<string>(this.getUsername() || '');

  constructor(private http: HttpClient, private router: Router) {}

  public isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
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
    this.usernameSubject.next('');
    this.router.navigate(['/login']);
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  getUsernameObservable(): Observable<string> {
    return this.usernameSubject.asObservable();
  }

  login(email: string, password: string) {
    return this.http.post<any>('http://localhost:3000/login', { email, password })
      .subscribe(response => {
        console.log('Login response:', response);
        if (response.username) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.username);
          this.usernameSubject.next(response.username);
          console.log('Username after login:', this.getUsername());
          this.router.navigate(['/dashboard']);
        } else {
          console.error('Login response missing username');
        }
      }, error => {
        console.error('Login failed', error);
      });
  }

  fetchUserDetails() {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>('http://localhost:3000/user', { headers })
      .subscribe(user => {
        console.log('User details:', user);
        localStorage.setItem('username', user.username);
        this.usernameSubject.next(user.username);
      }, error => {
        console.error('Failed to fetch user details', error);
      });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token!: string;  // Using definite assignment assertion

  constructor(private http: HttpClient, private router: Router) {}

  saveToken(token: string): void {
    localStorage.setItem('token', token);
    this.token = token;
  }

  getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('token') || '';
    }
    return this.token;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  }

  logout(): void {
    this.token = '';
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

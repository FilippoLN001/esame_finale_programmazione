import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  jwtHelper = new JwtHelperService();

  constructor(private router: Router) {}

  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token || this.jwtHelper.isTokenExpired(token)) {
      return false;
    }
    return true;
  }

  public getRole(): string {
    const token = this.getToken();
    if (!token) return '';

    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken ? decodedToken.role : '';
  }

  public getToken(): string {
    return localStorage.getItem('token') || '';
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

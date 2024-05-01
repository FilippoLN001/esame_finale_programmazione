// signin.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  user = {
    email: '',
    password: ''
  };

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  onLogin() {
    this.http.post('http://localhost:3000/login', this.user)
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.token);
          console.log("login effettuato con successso", this.user.email, this.user.password)
          this.snackBar.open('Login effettuato con successo', 'Chiudi', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Errore durante il login', error);
          this.snackBar.open('Login fallito: ' + error.error.message, 'Chiudi', { duration: 3000 });
        }
      });
  }
}

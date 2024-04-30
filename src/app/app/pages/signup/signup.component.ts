import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user = {
    nome: '',
    cognome: '',
    username: '',
    email: '',
    password: '',
    token: ''
  };
  hide = true;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  onSubmit() {
    if (this.user.nome && this.user.cognome && this.user.username && this.user.email && this.user.password) {
      this.http.post('http://localhost:3000/signup', this.user)
        .subscribe({
          next: (response: any) => {
            localStorage.setItem('token', response.token); // Salva il token nel localStorage
            
            this.snackBar.open('Registrazione effettuata con successo', 'Chiudi', { duration: 3000 });
            this.router.navigate(['/dashboard']); // Reindirizza alla dashboard
          },
          error: (error) => {
            console.error('Errore durante la registrazione', error);
            let errorMessage = 'Errore durante la registrazione';
            if (error.status === 409) {
              errorMessage = 'Utente già registrato';
            }
            this.snackBar.open(errorMessage, 'Chiudi', { duration: 3000 });
          }
        });
    } else {
      this.snackBar.open('Per favore riempi tutti i campi richiesti.', 'Chiudi', { duration: 3000 });
    }
  }
}

// signin.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin', // Selettore del componente
  templateUrl: './signin.component.html', // Percorso del template HTML del componente
  styleUrls: ['./signin.component.css'] // Percorso del file CSS del componente
})
export class SigninComponent {
  // Oggetto user che contiene i campi email e password
  user = {
    email: '',
    password: ''
  };

  hide = true; // Variabile per gestire la visibilità della password

  constructor(
    private http: HttpClient, // Iniezione del servizio HttpClient per fare richieste HTTP
    private snackBar: MatSnackBar, // Iniezione del servizio MatSnackBar per mostrare notifiche
    private router: Router // Iniezione del servizio Router per navigare tra le route
  ) {}

  // Metodo chiamato quando l'utente preme il pulsante di login
  onLogin() {
    // Esegue una richiesta POST all'endpoint di login con le credenziali dell'utente
    this.http.post('http://localhost:3000/login', this.user)
      .subscribe({
        // Se la richiesta ha successo, salva il token nel localStorage
        next: (response: any) => {
          localStorage.setItem('token', response.token);
          console.log("login effettuato con successo", this.user.email, this.user.password);
          // Mostra una notifica di successo
          this.snackBar.open('Login effettuato con successo', 'Chiudi', { duration: 3000 });
          // Naviga alla dashboard
          this.router.navigate(['/dashboard']);
        },
        // Se la richiesta fallisce, mostra un messaggio di errore
        error: (error) => {
          console.error('Errore durante il login', error);
          // Mostra una notifica di errore con il messaggio di errore
          this.snackBar.open('Login fallito: ' + error.error.message, 'Chiudi', { duration: 3000 });
        }
      });
  }
}

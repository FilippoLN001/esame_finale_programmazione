import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup', // Selettore del componente
  templateUrl: './signup.component.html', // Percorso del template HTML del componente
  styleUrls: ['./signup.component.css'] // Percorso del file CSS del componente
})
export class SignupComponent {
  // Oggetto user che contiene i campi necessari per la registrazione
  user = {
    nome: '',
    cognome: '',
    username: '',
    email: '',
    password: '',
    token: ''
  };
  hide = true; // Variabile per gestire la visibilità della password

  constructor(
    private http: HttpClient, // Iniezione del servizio HttpClient per fare richieste HTTP
    private snackBar: MatSnackBar, // Iniezione del servizio MatSnackBar per mostrare notifiche
    private router: Router // Iniezione del servizio Router per navigare tra le route
  ) {}

  // Metodo chiamato quando l'utente invia il modulo di registrazione
  onSubmit() {
    // Verifica che tutti i campi richiesti siano compilati
    if (this.user.nome && this.user.cognome && this.user.username && this.user.email && this.user.password) {
      // Esegue una richiesta POST all'endpoint di registrazione con i dati dell'utente
      this.http.post('http://localhost:3000/signup', this.user)
        .subscribe({
          // Se la richiesta ha successo, salva il token nel localStorage
          next: (response: any) => {
            localStorage.setItem('token', response.token); // Salva il token nel localStorage
            this.snackBar.open('Registrazione effettuata con successo', 'Chiudi', { duration: 3000 }); // Mostra una notifica di successo
            this.router.navigate(['/dashboard']); // Reindirizza alla dashboard
          },
          // Se la richiesta fallisce, gestisce l'errore
          error: (error) => {
            console.error('Errore durante la registrazione', error); // Logga l'errore nella console
            let errorMessage = 'Errore durante la registrazione';
            if (error.status === 409) {
              errorMessage = 'Utente già registrato'; // Messaggio di errore per l'utente già registrato
            }
            this.snackBar.open(errorMessage, 'Chiudi', { duration: 3000 }); // Mostra una notifica di errore
          }
        });
    } else {
      // Mostra una notifica se alcuni campi richiesti non sono compilati
      this.snackBar.open('Per favore riempi tutti i campi richiesti.', 'Chiudi', { duration: 3000 });
    }
  }
}

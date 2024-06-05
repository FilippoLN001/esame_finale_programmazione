import { Injectable } from '@angular/core'; // Importa il decoratore Injectable dal core di Angular
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Importa HttpClient e HttpHeaders dal modulo HTTP comune di Angular
import { Observable, throwError } from 'rxjs'; // Importa Observable e throwError da rxjs
import { catchError } from 'rxjs/operators'; // Importa l'operatore catchError da rxjs operators
import { Prodotto } from '../app/product-model/product-model.module'; // Importa l'interfaccia Prodotto dal modulo product-model

@Injectable({
  providedIn: 'root' // Indica che questo servizio è disponibile per l'iniezione delle dipendenze in tutta l'app
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products'; // URL base per l'API dei prodotti

  constructor(private http: HttpClient) {} // Iniezione del servizio HttpClient

  // Metodo per ottenere tutti i prodotti
  getProducts(): Observable<Prodotto[]> {
    return this.http.get<Prodotto[]>(this.apiUrl).pipe(
      catchError(this.handleError) // Gestisce gli errori
    );
  }

  // Metodo per ottenere un prodotto tramite il suo ID
  getProductById(id: number): Observable<Prodotto> {
    const url = `${this.apiUrl}/${id}`; // URL per il prodotto specifico
    return this.http.get<Prodotto>(url).pipe(
      catchError(this.handleError) // Gestisce gli errori
    );
  }

  // Metodo per aggiungere un nuovo prodotto
  addProduct(formData: FormData): Observable<Prodotto> {
    return this.http.post<Prodotto>(this.apiUrl, formData).pipe(
      catchError(this.handleError) // Gestisce gli errori
    );
  }

  // Metodo per aggiornare un prodotto esistente
  updateProduct(productId: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${productId}`, formData).pipe(
      catchError(this.handleError) // Gestisce gli errori
    );
  }

  // Metodo per eliminare un prodotto
  deleteProduct(id: number): Observable<{}> {
    const url = `${this.apiUrl}/${id}`; // URL per il prodotto specifico
    return this.http.delete(url).pipe(
      catchError(this.handleError) // Gestisce gli errori
    );
  }

  // Metodo per cercare prodotti
  searchProducts(searchText: string): Observable<Prodotto[]> {
    const url = `${this.apiUrl}/search?query=${searchText}`; // URL per l'endpoint di ricerca con parametro query
    return this.http.get<Prodotto[]>(url).pipe(
      catchError(this.handleError) // Gestisce gli errori
    );
  }

  // Metodo per gestire gli errori
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error); // Log dell'errore nella console
    return throwError('Something bad happened; please try again later.'); // Ritorna un messaggio di errore user-friendly
  }
}

// Importazioni:

// Injectable: Segna la classe come disponibile per l'iniezione delle dipendenze.
// HttpClient: Utilizzato per effettuare richieste HTTP.
// HttpHeaders: Utilizzato per definire gli header per le richieste HTTP.
// Observable e throwError: Utilizzati per gestire operazioni asincrone e errori.
// catchError: Un operatore RxJS utilizzato per gestire gli errori nello stream Observable.
// Prodotto: Il modello di dati per i prodotti.
// Decoratore @Injectable:

// Specifica che questo servizio è fornito a livello root, il che significa che è un singleton e può essere iniettato ovunque nell'applicazione.
// Classe del Servizio:

// apiUrl: L'URL base per gli endpoint API.
// Costruttore:

// http: L'istanza di HttpClient iniettata per effettuare richieste HTTP.
// Metodi:

// getProducts(): Recupera tutti i prodotti.
// getProductById(id: number): Recupera un prodotto tramite il suo ID.
// addProduct(formData: FormData): Aggiunge un nuovo prodotto. Accetta FormData per gestire i caricamenti di file.
// updateProduct(productId: string, formData: FormData): Aggiorna un prodotto esistente.
// deleteProduct(id: number): Elimina un prodotto tramite il suo ID.
// searchProducts(searchText: string): Cerca prodotti tramite una stringa di query.
// Gestione degli Errori:

// handleError(error: any): Log dell'errore e ritorno di un messaggio di errore user-friendly usando throwError.
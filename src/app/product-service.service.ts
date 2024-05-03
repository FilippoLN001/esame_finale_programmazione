import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Prodotto } from '../app/product-model/product-model.module';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  // httpOptions = {
  //   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  // };
  constructor(private http: HttpClient) {}

  // Ottieni tutti i prodotti
  getProducts(): Observable<Prodotto[]> {
    return this.http.get<Prodotto[]>(`${this.apiUrl}`);
  }

  // Ottieni un singolo prodotto per ID
  getProductById(id: number): Observable<Prodotto> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Prodotto>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Aggiungi un nuovo prodotto
  addProduct(product: Prodotto): Observable<Prodotto> {
    return this.http.post<Prodotto>(this.apiUrl, product, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Elimina un prodotto
  deleteProduct(id: number): Observable<{}> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError)
    );
  }

  // Modifica un prodotto esistente
  updateProduct(productId: string, formData: FormData): Observable<any> {
    return this.http.put(`http://localhost:3000/products/${productId}`, formData)
      .pipe(
        catchError(error => {
          console.error('Error updating product:', error);
          return throwError(() => new Error('Failed to update the product'));
        })
      );
  }


  // Gestisci gli errori di rete
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Un errore lato client o di rete
      console.error('An error occurred:', error.error.message);
    } else {
      // Il backend ha restituito un codice di risposta non riuscito
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    // Ritorna un Observable con un messaggio di errore
    return throwError('Something bad happened; please try again later.');
  }
}

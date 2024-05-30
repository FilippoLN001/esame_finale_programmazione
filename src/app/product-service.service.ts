import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Prodotto } from '../app/product-model/product-model.module';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Prodotto[]> {
    return this.http.get<Prodotto[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getProductById(id: number): Observable<Prodotto> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Prodotto>(url).pipe(
      catchError(this.handleError)
    );
  }

  addProduct(formData: FormData): Observable<Prodotto> {
    return this.http.post<Prodotto>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(productId: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${productId}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(id: number): Observable<{}> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError)
    );
  }

  searchProducts(searchText: string): Observable<Prodotto[]> {
    const url = `${this.apiUrl}/search?query=${searchText}`;
    return this.http.get<Prodotto[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }
}

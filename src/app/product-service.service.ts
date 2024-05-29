import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Prodotto, User } from '../app/product-model/product-model.module';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';
  private apriUrluser = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Prodotto[]> {
    return this.http.get<Prodotto[]>(`${this.apiUrl}`);
  }

  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apriUrluser}`);
  }
  getUserById(id: number): Observable<User> {
    const url = `${this.apriUrluser}/${id}`;
    return this.http.get<User>(url).pipe(
      catchError(this.handleError)
    );
  }


  getProductById(id: number): Observable<Prodotto> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Prodotto>(url).pipe(
      catchError(this.handleError)
    );
  }

  addProduct(product: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, product).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(id: number): Observable<{}> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(productId: string, formData: FormData): Observable<any> {
    return this.http.put(`http://localhost:3000/products/${productId}`, formData)
      .pipe(
        catchError(error => {
          console.error('Error updating product:', error);
          return throwError(() => new Error('Failed to update the product'));
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}

// cart.service.ts

import { Injectable } from '@angular/core';
import { Prodotto } from './product-model/product-model.module';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartProducts: Prodotto[] = [];
  private cartProductsSubject = new BehaviorSubject<Prodotto[]>(this.cartProducts);
  cartUpdated = this.cartProductsSubject.asObservable();

  addProductToCart(product: Prodotto) {
    this.cartProducts.push(product);
    this.cartProductsSubject.next(this.cartProducts);
  }

  getCartProducts(): Prodotto[] {
    return this.cartProducts;
  }

  clearCart() {
    this.cartProducts = [];
    this.cartProductsSubject.next(this.cartProducts);
  }
}

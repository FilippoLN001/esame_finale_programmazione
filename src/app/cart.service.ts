import { Injectable } from '@angular/core';
import { Prodotto } from './product-model/product-model.module';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartProducts: Prodotto[] = [];
  cartUpdated = new Subject<Prodotto[]>(); // Subject per notificare i cambiamenti del carrello

  addToCart(product: Prodotto) {
    this.cartProducts.push(product);
    this.cartUpdated.next(this.cartProducts); // Notifica i cambiamenti
  }

  getCartProducts(): Prodotto[] {
    return this.cartProducts;
  }
}

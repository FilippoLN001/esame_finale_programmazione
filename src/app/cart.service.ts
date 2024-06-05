import { Injectable } from '@angular/core'; // Importa il decoratore Injectable dal core di Angular
import { Prodotto } from './product-model/product-model.module'; // Importa l'interfaccia Prodotto dal modulo product-model
import { BehaviorSubject } from 'rxjs'; // Importa BehaviorSubject da rxjs

@Injectable({
  providedIn: 'root' // Indica che questo servizio è disponibile per l'iniezione delle dipendenze in tutta l'app
})
export class CartService {
  private cartProducts: Prodotto[] = []; // Array privato per memorizzare i prodotti nel carrello
  private cartProductsSubject = new BehaviorSubject<Prodotto[]>(this.cartProducts); // BehaviorSubject per gestire lo stato reattivo dei prodotti nel carrello
  cartUpdated = this.cartProductsSubject.asObservable(); // Osservabile che emette aggiornamenti sui prodotti nel carrello

  // Metodo per aggiungere un prodotto al carrello
  addProductToCart(product: Prodotto) {
    this.cartProducts.push(product); // Aggiunge il prodotto all'array dei prodotti nel carrello
    this.cartProductsSubject.next(this.cartProducts); // Emette un aggiornamento con l'array aggiornato dei prodotti nel carrello
  }

  // Metodo per ottenere i prodotti nel carrello
  getCartProducts(): Prodotto[] {
    return this.cartProducts; // Ritorna l'array dei prodotti nel carrello
  }

  // Metodo per svuotare il carrello
  clearCart() {
    this.cartProducts = []; // Svuota l'array dei prodotti nel carrello
    this.cartProductsSubject.next(this.cartProducts); // Emette un aggiornamento con l'array vuoto dei prodotti nel carrello
  }
}


// Importazioni:

// Injectable: Segna la classe come disponibile per l'iniezione delle dipendenze.
// Prodotto: Il modello di dati per i prodotti.
// BehaviorSubject: Utilizzato per gestire lo stato reattivo dei prodotti nel carrello.
// Decoratore @Injectable:

// Specifica che questo servizio è fornito a livello root, il che significa che è un singleton e può essere iniettato ovunque nell'applicazione.
// Classe del Servizio:

// cartProducts: Un array privato per memorizzare i prodotti nel carrello.
// cartProductsSubject: Un BehaviorSubject che emette aggiornamenti quando l'array dei prodotti nel carrello cambia.
// cartUpdated: Un osservabile derivato da cartProductsSubject che permette ai componenti di iscriversi agli aggiornamenti del carrello.
// Metodi:

// addProductToCart(product: Prodotto): Aggiunge un prodotto all'array dei prodotti nel carrello e emette un aggiornamento.
// getCartProducts(): Ritorna l'array dei prodotti nel carrello.
// clearCart(): Svuota l'array dei prodotti nel carrello e emette un aggiornamento.
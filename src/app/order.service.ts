import { Injectable } from '@angular/core'; // Importa il decoratore Injectable dal core di Angular
import { Subject } from 'rxjs'; // Importa Subject da rxjs
import { Prodotto } from './product-model/product-model.module'; // Importa l'interfaccia Prodotto dal modulo product-model

@Injectable({
  providedIn: 'root' // Indica che questo servizio è disponibile per l'iniezione delle dipendenze in tutta l'app
})
export class OrderService {
  private orders: Prodotto[] = []; // Array privato per memorizzare gli ordini
  private ordersUpdated = new Subject<Prodotto[]>(); // Subject per notificare gli aggiornamenti agli ordini

  // Metodo per ottenere tutti gli ordini
  getOrders() {
    return [...this.orders]; // Ritorna una copia dell'array degli ordini
  }

  // Metodo per ottenere l'osservabile per gli aggiornamenti degli ordini
  getOrderUpdateListener() {
    return this.ordersUpdated.asObservable(); // Ritorna un osservabile che emette aggiornamenti agli ordini
  }

  // Metodo per aggiungere un ordine
  addOrder(order: Prodotto) {
    this.orders.push(order); // Aggiunge l'ordine all'array degli ordini
    this.ordersUpdated.next([...this.orders]); // Emette un aggiornamento con la copia aggiornata degli ordini
  }

  // Metodo per rimuovere un ordine tramite indice
  removeOrder(index: number) {
    this.orders.splice(index, 1); // Rimuove l'ordine dall'array tramite indice
    this.ordersUpdated.next([...this.orders]); // Emette un aggiornamento con la copia aggiornata degli ordini
  }
}


// Importazioni:

// Injectable: Segna la classe come disponibile per l'iniezione delle dipendenze.
// Subject: Utilizzato per emettere eventi e gestire lo stato reattivo.
// Prodotto: Il modello di dati per i prodotti.
// Decoratore @Injectable:

// Specifica che questo servizio è fornito a livello root, il che significa che è un singleton e può essere iniettato ovunque nell'applicazione.
// Classe del Servizio:

// orders: Un array privato per memorizzare gli ordini.
// ordersUpdated: Un Subject che emette aggiornamenti quando l'array degli ordini cambia.
// Metodi:

// getOrders(): Ritorna una copia dell'array degli ordini.
// getOrderUpdateListener(): Ritorna un osservabile che emette aggiornamenti agli ordini.
// addOrder(order: Prodotto): Aggiunge un ordine all'array e emette un aggiornamento.
// removeOrder(index: number): Rimuove un ordine dall'array tramite indice e emette un aggiornamento.
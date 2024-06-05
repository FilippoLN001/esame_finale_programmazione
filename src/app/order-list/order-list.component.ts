// Importa i moduli e le dipendenze necessarie
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service'; // Servizio degli ordini
import { Prodotto } from '../product-model/product-model.module'; // Modello del prodotto
import { CurrencyPipe } from '@angular/common'; // Pipe per formattare le valute

// Decoratore @Component che definisce il componente
@Component({
  selector: 'app-order-list', // Selettore del componente
  templateUrl: './order-list.component.html', // Percorso del file HTML del template
  styleUrls: ['./order-list.component.css'], // Percorso del file CSS degli stili
  providers: [CurrencyPipe] // Aggiungi CurrencyPipe come provider
})
export class OrderListComponent implements OnInit {
  orders: Prodotto[] = []; // Array per memorizzare gli ordini

  // Costruttore del componente
  constructor(private orderService: OrderService, private currencyPipe: CurrencyPipe) {}

  // Metodo che viene eseguito all'inizializzazione del componente
  ngOnInit() {
    this.orders = this.orderService.getOrders(); // Ottiene gli ordini dal servizio
    this.orderService.getOrderUpdateListener().subscribe((orders: Prodotto[]) => {
      this.orders = orders; // Aggiorna gli ordini quando cambia
    });
  }

  // Metodo per formattare i valori in valuta
  formatCurrency(value: number): string {
    return this.currencyPipe.transform(value, 'EUR')!; // Usa il CurrencyPipe per formattare
  }

  // Metodo per rimuovere un ordine dalla lista
  removeOrder(index: number) {
    this.orderService.removeOrder(index); // Rimuove l'ordine dal servizio
  }
}

// order-list.component.ts
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { Prodotto } from '../product-model/product-model.module';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  providers: [CurrencyPipe] // Aggiungi CurrencyPipe come provider
})
export class OrderListComponent implements OnInit {
  orders: Prodotto[] = [];

  constructor(private orderService: OrderService, private currencyPipe: CurrencyPipe) {}

  ngOnInit() {
    this.orders = this.orderService.getOrders();
    this.orderService.getOrderUpdateListener().subscribe((orders: Prodotto[]) => {
      this.orders = orders;
    });
  }

  formatCurrency(value: number): string {
    return this.currencyPipe.transform(value, 'EUR')!;
  }

  removeOrder(index: number) {
    this.orderService.removeOrder(index);
  }
}

// order.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Prodotto } from './product-model/product-model.module';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Prodotto[] = [];
  private ordersUpdated = new Subject<Prodotto[]>();

  getOrders() {
    return [...this.orders];
  }

  getOrderUpdateListener() {
    return this.ordersUpdated.asObservable();
  }

  addOrder(order: Prodotto) {
    this.orders.push(order);
    this.ordersUpdated.next([...this.orders]);
  }

  removeOrder(index: number) {
    this.orders.splice(index, 1);
    this.ordersUpdated.next([...this.orders]);
  }
}

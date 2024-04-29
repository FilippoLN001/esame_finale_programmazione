// src/app/component/product/product.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../product-service.service';
import { Prodotto } from '../product-model/product-model.module';  // Assicurati che il percorso sia corretto

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
@Input() listaProdotti: Prodotto[] = [];
 products : any

  constructor(private productService: ProductService) {}

  ngOnInit(){
    this.productService.getProducts().subscribe(
      (prodotti: Prodotto[]) => {
        this.listaProdotti = prodotti;
        this.products = prodotti; // Assumendo che tu voglia tenere due liste separate
      },
      (error) => {
        console.error('Errore durante il recupero dei prodotti:', error);
        // Considera di mostrare un messaggio di errore nell'UI
      }
    );
  }
}

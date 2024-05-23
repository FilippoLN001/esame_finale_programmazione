import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../product-service.service';
import { Router } from '@angular/router';
import { Prodotto } from '../product-model/product-model.module';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @Input() listaProdotti: Prodotto[] = [];
  products: any;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(
      (prodotti: Prodotto[]) => {
        this.listaProdotti = prodotti;
        this.products = prodotti;
        this.logImagePaths(); // Log dei percorsi delle immagini
      },
      (error) => {
        console.error('Errore durante il recupero dei prodotti:', error);
      }
    );
  }

  logImagePaths() {
    this.products.forEach((product: { immagine: any; }) => {
      console.log('Percorso immagine:', product.immagine);
    });
  }

  redirectToProductDetail(productId: number) {
    this.router.navigate(['/products', productId]);
  }
}

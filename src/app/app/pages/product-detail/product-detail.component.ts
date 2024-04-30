import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../../product-service.service';
import { Prodotto } from '../../../product-model/product-model.module';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  @Input() product: Prodotto | any; // Ricevi il prodotto come input dal componente padre

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getProduct_detailById();
  }
  
  getProduct_detailById() {
    const idString = this.route.snapshot.paramMap.get('id');
    if (idString !== null) {
      const id = +idString;
      this.productService.getProductById(id).subscribe(
        (product: Prodotto) => {
          this.product = product;
        },
        (error) => {
          console.error('Errore durante il recupero del prodotto:', error);
          // Considera di mostrare un messaggio di errore nell'UI
        }
      );
    } else {
      console.error('ID non trovato nella route.');
    }
  }
  

  addToCart() {
    // Implementa la logica per aggiungere il prodotto al carrello
    console.log('Aggiunto al carrello:', this.product);
  }
}

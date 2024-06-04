import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../product-service.service';
import { Prodotto } from '../../../product-model/product-model.module';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  products: Prodotto[] = [];
  filteredProducts: Prodotto[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(
      (products: Prodotto[]) => {
        this.products = products;
        this.filteredProducts = products;
        this.route.queryParams.subscribe(params => {
          const search = params['search'];
          if (search) {
            this.filteredProducts = this.products.filter(product =>
              product.nome.toLowerCase().includes(search.toLowerCase()) ||
              product.categoria.toLowerCase().includes(search.toLowerCase()) ||
              product.marca.toLowerCase().includes(search.toLowerCase())
            );
          }
        });
      },
      (error) => {
        console.error('Errore durante il recupero dei prodotti:', error);
      }
    );
  }
}

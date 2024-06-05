import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Importazione di ActivatedRoute per accedere ai parametri della route
import { ProductService } from '../../../product-service.service'; // Importazione del servizio dei prodotti
import { Prodotto } from '../../../product-model/product-model.module'; // Importazione del modello Prodotto

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  products: Prodotto[] = []; // Array per memorizzare tutti i prodotti
  filteredProducts: Prodotto[] = []; // Array per memorizzare i prodotti filtrati

  constructor(
    private productService: ProductService, // Iniezione del servizio dei prodotti
    private route: ActivatedRoute // Iniezione di ActivatedRoute per accedere ai parametri della route
  ) {}

  // Metodo che viene eseguito all'inizializzazione del componente
  ngOnInit() {
    // Chiamata al servizio per ottenere tutti i prodotti
    this.productService.getProducts().subscribe(
      (products: Prodotto[]) => {
        this.products = products; // Assegna i prodotti recuperati all'array products
        this.filteredProducts = products; // Inizialmente tutti i prodotti sono visualizzati
        // Sottoscrizione ai parametri della route per rilevare eventuali cambiamenti
        this.route.queryParams.subscribe(params => {
          const search = params['search']; // Recupera il parametro di ricerca
          if (search) {
            // Filtra i prodotti in base al parametro di ricerca
            this.filteredProducts = this.products.filter(product =>
              product.nome.toLowerCase().includes(search.toLowerCase()) || // Filtra per nome
              product.categoria.toLowerCase().includes(search.toLowerCase()) || // Filtra per categoria
              product.marca.toLowerCase().includes(search.toLowerCase()) // Filtra per marca
            );
          }
        });
      },
      (error) => {
        console.error('Errore durante il recupero dei prodotti:', error); // Gestione degli errori
      }
    );
  }
}

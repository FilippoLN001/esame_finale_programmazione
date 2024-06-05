import { Component, Input, OnInit } from '@angular/core';  // Importa componenti e decoratori necessari da Angular core
import { ProductService } from '../product-service.service';  // Importa il servizio per gestire i prodotti
import { Router, ActivatedRoute } from '@angular/router';  // Importa Router e ActivatedRoute per gestire la navigazione e i parametri della route
import { Prodotto } from '../product-model/product-model.module';  // Importa il modello Prodotto

@Component({
  selector: 'product',  // Selettore per il componente
  templateUrl: './product.component.html',  // Template HTML del componente
  styleUrls: ['./product.component.css']  // Stili CSS del componente
})
export class ProductComponent implements OnInit {
  @Input() listaProdotti: Prodotto[] = [];  // Input che permette di passare un array di prodotti al componente
  products: Prodotto[] = [];  // Array per memorizzare tutti i prodotti
  filteredProducts: Prodotto[] = [];  // Array per memorizzare i prodotti filtrati

  constructor(
    private route: ActivatedRoute,  // ActivatedRoute per accedere ai parametri della route
    private productService: ProductService,  // Servizio per gestire i prodotti
    private router: Router  // Router per la navigazione
  ) {}

  ngOnInit() {
    // Chiama il servizio per ottenere i prodotti all'inizializzazione del componente
    this.productService.getProducts().subscribe(
      (prodotti: Prodotto[]) => {
        this.products = prodotti;
        this.filteredProducts = prodotti;
        this.logImagePaths();  // Log dei percorsi delle immagini per debug
        // Sottoscrizione ai parametri della route per il filtro di ricerca
        this.route.queryParams.subscribe(params => {
          const search = params['search'] || '';
          this.filterProducts(search);
        });
      },
      error => {
        console.error('Errore durante il recupero dei prodotti:', error);  // Gestione degli errori
      }
    );
  }

  // Metodo per loggare i percorsi delle immagini
  logImagePaths() {
    this.products.forEach(product => {
      console.log('Percorso immagine:', product.immagine);
    });
  }

  // Metodo per reindirizzare al dettaglio del prodotto
  redirectToProductDetail(productId: number) {
    this.router.navigate(['/products', productId]);
  }

  // Metodo per filtrare i prodotti in base alla ricerca
  filterProducts(search: string) {
    if (search) {
      this.filteredProducts = this.products.filter(product =>
        product.nome.toLowerCase().includes(search.toLowerCase()) ||
        product.categoria.toLowerCase().includes(search.toLowerCase()) ||
        product.marca.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      this.filteredProducts = this.products;
    }
  }
}

// Imports:

// Importa componenti e decoratori necessari da Angular core (Component, Input, OnInit).
// Importa ProductService per gestire i prodotti.
// Importa Router e ActivatedRoute per gestire la navigazione e i parametri della route.
// Importa Prodotto dal modello dei prodotti.
// Decoratore @Component:

// Definisce il selettore del componente, il template HTML e i file di stile CSS associati.
// Class ProductComponent:

// @Input() listaProdotti: Input che permette di passare un array di prodotti al componente.
// products: Array per memorizzare tutti i prodotti.
// filteredProducts: Array per memorizzare i prodotti filtrati.
// Constructor:

// Inietta ActivatedRoute, ProductService e Router.
// ngOnInit:

// Chiama getProducts del servizio per ottenere i prodotti all'inizializzazione del componente.
// Sottoscrive ai parametri della route per gestire il filtro di ricerca.
// logImagePaths:

// Metodo per loggare i percorsi delle immagini per il debug.
// redirectToProductDetail:

// Metodo per reindirizzare al dettaglio del prodotto.
// filterProducts:

// Metodo per filtrare i prodotti in base al testo di ricerca.
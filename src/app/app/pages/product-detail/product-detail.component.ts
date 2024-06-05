import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../../product-service.service'; // Importazione del servizio dei prodotti
import { Prodotto } from '../../../product-model/product-model.module'; // Importazione del modello Prodotto
import { ActivatedRoute, Router } from '@angular/router'; // Importazione di ActivatedRoute e Router
import { CartService } from '../../../cart.service'; // Importazione del servizio del carrello

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  @Input() product: Prodotto | any; // Riceve il prodotto come input dal componente padre

  constructor(
    private productService: ProductService, // Iniezione del servizio dei prodotti
    private route: ActivatedRoute, // Iniezione di ActivatedRoute per accedere ai parametri della route
    private cartService: CartService, // Iniezione del servizio del carrello
    private router: Router // Iniezione del servizio Router
  ) {}

  // Metodo che viene eseguito all'inizializzazione del componente
  ngOnInit() {
    this.getProduct_detailById(); // Chiama il metodo per ottenere i dettagli del prodotto
  }

  // Metodo per ottenere i dettagli del prodotto tramite ID
  getProduct_detailById() {
    const idString = this.route.snapshot.paramMap.get('id'); // Recupera l'ID dal parametro della route
    if (idString !== null) {
      const id = +idString; // Converte l'ID in numero
      this.productService.getProductById(id).subscribe(
        (product: Prodotto) => {
          this.product = product; // Assegna il prodotto recuperato alla proprietà product
        },
        (error) => {
          console.error('Errore durante il recupero del prodotto:', error); // Gestione degli errori
        }
      );
    } else {
      console.error('ID non trovato nella route.'); // Messaggio di errore se l'ID non è presente nella route
    }
  }

  // Metodo per aggiungere il prodotto al carrello
  addToCart() {
    this.cartService.addProductToCart(this.product); // Aggiunge il prodotto al carrello utilizzando il servizio del carrello
    console.log('Aggiunto al carrello:', this.product); // Log del prodotto aggiunto al carrello
    this.router.navigate(['/dashboard']); // Naviga alla dashboard
  }
}

import { Component, Input} from '@angular/core';
import { Prodotto } from '../../../product-model/product-model.module';
import { ProductService } from '../../../product-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  @Input() listaProdotti: Prodotto[] = [];
  products: any;
  dt1: any;

    constructor(private productService: ProductService,private router: Router ) {}

    ngOnInit() {
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
  editProduct(productId: number) {
    // Naviga alla route di modifica, assicurati che la route sia configurata in app-routing.module.ts
    this.router.navigate(['edit-product', productId]); // Assumi che `product.id` sia l'identificatore unico
  }

  deleteProduct(product: any) {
     // Chiamata alla funzione di eliminazione del servizio ProductService
     this.productService.deleteProduct(product.id).subscribe(
      () => {
        console.log('Product deleted successfully');
        // Aggiorna la lista dei prodotti qui se necessario
        this.refreshPage();
      },
      error => {
        console.error('Failed to delete product:', error);
        // Gestisci gli errori qui
      }
    );
  }

  refreshPage(){
    window.location.reload();
  }
}

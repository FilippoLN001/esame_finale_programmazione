import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { Prodotto } from '../product-model/product-model.module';
import { MenuItem } from 'primeng/api';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart-dropdown',
  templateUrl: './cart-dropdown.component.html',
  styleUrls: ['./cart-dropdown.component.css']
})
export class CartDropdownComponent implements OnInit {
  cartMenuItems: MenuItem[] = []; // Array che contiene gli elementi del menu a tendina del carrello
  showCartMenu = false; // Variabile per mostrare o nascondere il menu a tendina del carrello

  constructor(private router: Router, public cartService: CartService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    // Al momento dell'inizializzazione del componente, aggiorna il menu del carrello
    this.updateCartMenu();
    // Sottoscrizione al Subject cartUpdated per aggiornare il menu ogni volta che il carrello viene modificato
    this.cartService.cartUpdated.subscribe(() => {
      this.updateCartMenu();
    });
  }

  // Metodo per mostrare o nascondere il menu a tendina del carrello
  toggleCartMenu() {
    this.showCartMenu = !this.showCartMenu;
  }

  // Metodo per aggiornare gli elementi del menu a tendina del carrello
  updateCartMenu() {
    const products = this.cartService.getCartProducts(); // Recupera i prodotti nel carrello dal servizio
    // Mappa i prodotti in un array di MenuItem per il menu a tendina
    this.cartMenuItems = products.map((product: Prodotto) => {
      return {
        label: `${product.nome} - ${product.prezzo}`, // Etichetta del prodotto
        icon: 'pi pi-fw pi-cart', // Icona del carrello
        command: () => {
          // Comando eseguito al clic sull'elemento del menu
          this.router.navigate(['/products', product.id]);
        }
      };
    });
  }

  // Metodo per effettuare il checkout
  checkout() {
    // Mostra un messaggio di conferma utilizzando MatSnackBar
    this.snackBar.open('Ordine effettuato con successo!', 'Chiudi', {
      duration: 3000, // Durata del messaggio in millisecondi
    });
    this.cartService.clearCart(); // Pulisce il carrello chiamando il metodo clearCart() del servizio
    this.updateCartMenu(); // Aggiorna il menu del carrello
  }
}

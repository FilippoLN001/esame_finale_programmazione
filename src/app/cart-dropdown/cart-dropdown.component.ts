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
  cartMenuItems: MenuItem[] = [];
  showCartMenu = false;

  constructor(private router: Router, public cartService: CartService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.updateCartMenu();
    this.cartService.cartUpdated.subscribe(() => {
      this.updateCartMenu();
    });
  }

  toggleCartMenu() {
    this.showCartMenu = !this.showCartMenu;
  }

  updateCartMenu() {
    const products = this.cartService.getCartProducts();
    this.cartMenuItems = products.map((product: Prodotto) => {
      return {
        label: `${product.nome} - ${product.prezzo}`,
        icon: 'pi pi-fw pi-cart',
        command: () => {
          this.router.navigate(['/products', product.id]);
        }
      };
    });
  }

  checkout() {
    this.snackBar.open('Ordine effettuato con successo!', 'Chiudi', {
      duration: 3000,
    });
    this.cartService.clearCart(); // Pulisce il carrello
    this.updateCartMenu();
  }
}

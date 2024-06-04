// navbar.component.ts
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CartService } from '../cart.service';
import { Prodotto } from '../product-model/product-model.module';
import { MenuItem } from 'primeng/api';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  searchText: string = '';
  username: string = '';
  showSearch: boolean = false;
  showCartMenu: boolean = false;
  cartMenuItems: MenuItem[] = [];

  @ViewChild('searchBox') searchBox!: ElementRef;

  constructor(
    private router: Router,
    public authService: AuthService,
    public cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.authService.getUsernameObservable().subscribe((username: string) => {
      this.username = username;
    });

    if (this.authService.isLoggedIn()) {
      this.authService.fetchUserDetails();
    }

    this.updateCartMenu();
    this.cartService.cartUpdated.subscribe(() => {
      this.updateCartMenu();
    });
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      setTimeout(() => {
        this.searchBox.nativeElement.classList.add('open');
        this.searchBox.nativeElement.focus();
      });
    } else {
      this.searchBox.nativeElement.classList.remove('open');
    }
  }

  search(): void {
    this.router.navigate(['/dashboard'], { queryParams: { search: this.searchText } });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
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
    this.cartService.clearCart();
    this.updateCartMenu();
    this.snackBar.open('Ordine effettuato con successo!', 'Chiudi', {
      duration: 3000,
    });
  }
}

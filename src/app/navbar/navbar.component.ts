import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CartService } from '../cart.service';
import { Prodotto } from '../product-model/product-model.module';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  searchText: string = '';
  badgeCount: number = 0;
  username: string = '';

  constructor(private router: Router, public authService: AuthService,private cartService: CartService) {}

  @ViewChild('searchBox') searchBox!: ElementRef;
  showSearch: boolean = false;
  cartProducts: Prodotto[] = [];
  showCartDropdown = false;

  ngOnInit() {
    this.authService.getUsernameObservable().subscribe((username: string) => {
      console.log('Username from observable:', username);
      this.username = username;
      console.log('Username set in component:', this.username);
    });

    // Fetch user details if token exists
    if (this.authService.isLoggedIn()) {
      this.authService.fetchUserDetails();
    }

    this.cartProducts = this.cartService.getCartProducts();
    this.cartService.cartUpdated.subscribe((products: Prodotto[]) => {
      this.cartProducts = products;
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

  incrementBadge() {
    this.badgeCount++;
  }

  toggleCartDropdown() {
    this.showCartDropdown = !this.showCartDropdown;
  }
}

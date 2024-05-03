import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  searchText: string = '';
  badgeCount: number = 0;  // Inizializza il conteggio a 0
  constructor(private router: Router, public authService: AuthService) {}

  @ViewChild('searchBox') searchBox!: ElementRef;
  showSearch: boolean = false;

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

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  incrementBadge() {
    this.badgeCount++;  // Incrementa il conteggio di 1 ogni volta che il bottone viene cliccato
  }
}

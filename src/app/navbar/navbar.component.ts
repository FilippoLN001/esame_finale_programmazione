import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  searchText: string = '';
  username: string = '';
  showSearch: boolean = false;

  @ViewChild('searchBox') searchBox!: ElementRef;

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit() {
    this.authService.getUsernameObservable().subscribe((username: string) => {
      this.username = username;
    });

    if (this.authService.isLoggedIn()) {
      this.authService.fetchUserDetails();
    }
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
}

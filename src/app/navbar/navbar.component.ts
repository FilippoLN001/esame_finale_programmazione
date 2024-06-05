// Importazioni necessarie dai moduli Angular
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

// Decoratore @Component che definisce il componente
@Component({
  selector: 'app-navbar', // Selettore del componente
  templateUrl: './navbar.component.html', // Percorso del file HTML del template
  styleUrls: ['./navbar.component.css'] // Percorso del file CSS degli stili
})
export class NavbarComponent implements OnInit {
  searchText: string = ''; // Testo di ricerca
  username: string = ''; // Nome utente
  showSearch: boolean = false; // Stato di visualizzazione della barra di ricerca

  @ViewChild('searchBox') searchBox!: ElementRef; // Riferimento alla casella di ricerca

  // Costruttore del componente
  constructor(private router: Router, public authService: AuthService) {}

  // Metodo che viene eseguito all'inizializzazione del componente
  ngOnInit() {
    // Sottoscrizione all'osservabile del nome utente
    this.authService.getUsernameObservable().subscribe((username: string) => {
      this.username = username;
    });

    // Verifica se l'utente è loggato e recupera i dettagli dell'utente
    if (this.authService.isLoggedIn()) {
      this.authService.fetchUserDetails();
    }
  }

  // Metodo per mostrare/nascondere la barra di ricerca
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

  // Metodo per eseguire la ricerca e navigare alla dashboard con i parametri di ricerca
  search(): void {
    this.router.navigate(['/dashboard'], { queryParams: { search: this.searchText } });
  }

  // Metodo per navigare a una rotta specifica
  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  // Metodo per eseguire il logout e navigare alla pagina di login
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

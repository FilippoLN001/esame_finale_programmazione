import { Component, OnInit } from '@angular/core'; // Importa Component e OnInit da Angular core
import { PrimeNGConfig } from 'primeng/api'; // Importa PrimeNGConfig dall'API di PrimeNG

@Component({
  selector: 'app-root', // Definisce il selettore per il componente
  templateUrl: './app.component.html', // Specifica il file HTML del template
  styleUrl: './app.component.css' // Specifica il file CSS per il componente
})
export class AppComponent implements OnInit { // Definisce la classe del componente che implementa OnInit
  title = 'TechHive'; // Definisce una proprietà titolo per il componente

  // Inietta PrimeNGConfig nel costruttore
  constructor(private primengConfig: PrimeNGConfig) {}

  // Metodo ngOnInit che viene chiamato al momento dell'inizializzazione del componente
  ngOnInit() {
    // Configura gli z-index per vari componenti di PrimeNG
    this.primengConfig.zIndex = {
        modal: 1100,    // z-index per dialoghi e sidebar
        overlay: 1000,  // z-index per dropdown e overlay panel
        menu: 1000,     // z-index per menù overlay
        tooltip: 1100   // z-index per tooltip
    };
  }
}

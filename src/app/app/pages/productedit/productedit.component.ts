import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; // Importazione dei moduli necessari per la gestione dei form
import { ProductService } from '../../../product-service.service'; // Importazione del servizio dei prodotti
import { ActivatedRoute, Router } from '@angular/router'; // Importazione di ActivatedRoute e Router per la navigazione
import { Prodotto } from '../../../product-model/product-model.module'; // Importazione del modello Prodotto

@Component({
  selector: 'app-productedit', // Selettore del componente
  templateUrl: './productedit.component.html', // Percorso del template HTML del componente
  styleUrls: ['./productedit.component.css'] // Percorso del file CSS del componente
})
export class ProducteditComponent implements OnInit {
  productForm!: FormGroup; // Definizione del form group
  selectedFile?: File; // Variabile per il file selezionato, opzionale per gestire lo stato undefined
  currentImagePath: string = ''; // Variabile per memorizzare il percorso dell'immagine corrente

  constructor(
    private fb: FormBuilder, // Iniezione di FormBuilder per creare form group
    private productService: ProductService, // Iniezione del servizio dei prodotti
    private route: ActivatedRoute, // Iniezione di ActivatedRoute per accedere ai parametri della route
    private router: Router // Iniezione di Router per la navigazione
  ) {}

  // Metodo che viene eseguito all'inizializzazione del componente
  ngOnInit() {
    this.initForm(); // Inizializza il form
    this.loadProduct(); // Carica i dati del prodotto
  }

  // Metodo per inizializzare il form group
  initForm() {
    this.productForm = this.fb.group({
      nome: ['', Validators.required], // Campo nome con validazione obbligatoria
      marca: ['', Validators.required], // Campo marca con validazione obbligatoria
      categoria: ['', Validators.required], // Campo categoria con validazione obbligatoria
      prezzo: ['', [Validators.required, Validators.min(0)]], // Campo prezzo con validazione obbligatoria e valore minimo
      descrizione: ['', Validators.required], // Campo descrizione con validazione obbligatoria
      data_messa_in_vendita: ['', Validators.required] // Campo data di messa in vendita con validazione obbligatoria
    });
  }

  // Metodo per caricare i dati del prodotto da modificare
  loadProduct() {
    const id = this.route.snapshot.params['id']; // Ottiene l'ID del prodotto dai parametri della route
    if (!id) {
      console.error('Product ID is null');
      return;
    }
    this.productService.getProductById(id).subscribe(product => {
      this.productForm.patchValue(product); // Riempie il form con i dati del prodotto
      this.currentImagePath = product.immagine; // Salva il percorso corrente dell'immagine
    }, error => {
      console.error('Failed to load product:', error); // Gestisce gli errori durante il caricamento del prodotto
    });
  }

  // Metodo per gestire la selezione del file
  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement; // Ottiene l'elemento di input del file
    if (element.files && element.files.length > 0) {
      this.selectedFile = element.files[0]; // Salva il file selezionato
    }
  }

  // Metodo per gestire l'invio del form
  onSubmit() {
    if (this.productForm.valid) {
      const productId = this.route.snapshot.params['id']; // Ottiene l'ID del prodotto dai parametri della route
      if (!productId) {
        alert('Product ID is missing');
        return;
      }

      const formData = new FormData(); // Crea un nuovo FormData
      if (this.selectedFile) {
        formData.append('immagine', this.selectedFile); // Aggiunge il file selezionato al FormData
      } else {
        formData.append('immagine', this.currentImagePath); // Utilizza il percorso dell'immagine corrente se non è stato selezionato un nuovo file
      }
      Object.keys(this.productForm.value).forEach(key => {
        formData.append(key, this.productForm.value[key]); // Aggiunge gli altri valori del form al FormData
      });

      this.productService.updateProduct(productId, formData).subscribe({
        next: () => {
          console.log('Product updated successfully.');
          this.router.navigate(['/dashboard']); // Naviga alla dashboard dopo l'aggiornamento del prodotto
        },
        error: (err) => {
          console.error('Update failed:', err);
          alert('Failed to update product.'); // Mostra un messaggio di errore se l'aggiornamento fallisce
        }
      });
    } else {
      alert('Form is not valid'); // Mostra un messaggio di errore se il form non è valido
    }
  }
}

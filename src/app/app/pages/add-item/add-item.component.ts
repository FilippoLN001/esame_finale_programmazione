import { Component } from '@angular/core';
import { ProductService } from '../../../product-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Decoratore @Component definisce i metadati per il componente
@Component({
  selector: 'app-add-item', // Selettore per il componente, usato nel template HTML
  templateUrl: './add-item.component.html', // Percorso al file template HTML del componente
  styleUrls: ['./add-item.component.css'] // Percorso al file CSS del componente
})
export class AddItemComponent {
  // Definizione della proprietà productForm di tipo FormGroup
  productForm: FormGroup;
  router: any; // Proprietà per il router

  // Costruttore della classe
  constructor(
    private fb: FormBuilder, // Iniezione di dipendenza per FormBuilder
    private productService: ProductService // Iniezione di dipendenza per ProductService
  ) {
    // Inizializzazione del FormGroup con i controlli e le validazioni
    this.productForm = this.fb.group({
      nome: ['', Validators.required], // Campo 'nome' con validazione obbligatoria
      marca: ['', Validators.required], // Campo 'marca' con validazione obbligatoria
      categoria: ['', Validators.required], // Campo 'categoria' con validazione obbligatoria
      prezzo: ['', Validators.required], // Campo 'prezzo' con validazione obbligatoria
      immagine: [null, Validators.required], // Campo 'immagine' con validazione obbligatoria
      descrizione: ['', Validators.required], // Campo 'descrizione' con validazione obbligatoria
      data_messa_in_vendita: ['', Validators.required] // Campo 'data_messa_in_vendita' con validazione obbligatoria
    });
  }

  // Metodo per gestire il cambiamento del file
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      // Aggiornamento del controllo 'immagine' nel form con il file selezionato
      this.productForm.patchValue({
        immagine: file
      });
      this.productForm.get('immagine')!.updateValueAndValidity(); // Aggiornamento della validità del controllo
    }
  }

  // Metodo per aggiungere il prodotto
  addProduct() {
    if (this.productForm.invalid) {
      return this.router.navigate('/dashboard'); // Navigazione alla dashboard se il form è invalido
    }

    // Creazione di un oggetto FormData per inviare i dati del prodotto
    const formData: FormData = new FormData();
    formData.append('nome', this.productForm.get('nome')!.value);
    formData.append('marca', this.productForm.get('marca')!.value);
    formData.append('categoria', this.productForm.get('categoria')!.value);
    formData.append('prezzo', this.productForm.get('prezzo')!.value);
    formData.append('immagine', this.productForm.get('immagine')!.value);
    formData.append('descrizione', this.productForm.get('descrizione')!.value);
    formData.append('data_messa_in_vendita', this.productForm.get('data_messa_in_vendita')!.value);

    // Chiamata al servizio per aggiungere il prodotto
    this.productService.addProduct(formData).subscribe(
      response => {
        console.log('Prodotto aggiunto con successo:', response); // Log di successo
      },
      error => {
        console.error('Errore durante l\'aggiunta del prodotto:', error); // Log di errore
      }
    );
  }
}

import { Component } from '@angular/core';
import { ProductService } from '../../../product-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {
  productForm: FormGroup;
  router: any;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      nome: ['', Validators.required],
      marca: ['', Validators.required],
      categoria: ['', Validators.required],
      prezzo: ['', Validators.required],
      immagine: [null, Validators.required],
      descrizione: ['', Validators.required],
      data_messa_in_vendita: ['', Validators.required]
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.productForm.patchValue({
        immagine: file
      });
      this.productForm.get('immagine')!.updateValueAndValidity();
    }
  }

  addProduct() {
    if (this.productForm.invalid) {
      return  this.router.navigate('/dashboard');;
    }

    const formData: FormData = new FormData();
    formData.append('nome', this.productForm.get('nome')!.value);
    formData.append('marca', this.productForm.get('marca')!.value);
    formData.append('categoria', this.productForm.get('categoria')!.value);
    formData.append('prezzo', this.productForm.get('prezzo')!.value);
    formData.append('immagine', this.productForm.get('immagine')!.value);
    formData.append('descrizione', this.productForm.get('descrizione')!.value);
    formData.append('data_messa_in_vendita', this.productForm.get('data_messa_in_vendita')!.value);

    this.productService.addProduct(formData).subscribe(
      response => {
        console.log('Prodotto aggiunto con successo:', response);
      },
      error => {
        console.error('Errore durante l\'aggiunta del prodotto:', error);
      }
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../../product-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Prodotto } from '../../../product-model/product-model.module';

@Component({
  selector: 'app-productedit',
  templateUrl: './productedit.component.html',
  styleUrls: ['./productedit.component.css']
})
export class ProducteditComponent implements OnInit {
  productForm!: FormGroup;
  selectedFile?: File;  // Use optional for better handling of undefined state

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadProduct();
  }

  initForm() {
    this.productForm = this.fb.group({
      nome: ['', Validators.required],
      marca: ['', Validators.required],
      categoria: ['', Validators.required],
      prezzo: ['', [Validators.required, Validators.min(0)]],
      descrizione: ['', Validators.required],
      data_messa_in_vendita: ['', Validators.required]
    });
  }

  loadProduct() {
    const id = this.route.snapshot.params['id'];
    if (!id) {
      console.error('Product ID is null');
      return;
    }
    this.productService.getProductById(id).subscribe(product => {
      this.productForm.patchValue(product);
    }, error => {
      console.error('Failed to load product:', error);
    });
  }
  
  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedFile = element.files[0];
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const productId = this.route.snapshot.params['id'];
      if (!productId) {
        alert('Product ID is missing');
        return;
      }
  
      const formData = new FormData();
      if (this.selectedFile) {
        formData.append('immagine', this.selectedFile, this.selectedFile.name);
      }
      Object.keys(this.productForm.value).forEach(key => {
        formData.append(key, this.productForm.value[key]);
      });
  
      this.productService.updateProduct(productId, formData).subscribe({
        next: () => {
          console.log('Product updated successfully.');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Update failed:', err);
          alert('Failed to update product.');
        }
      });
    } else {
      alert('Form is not valid');
    }
  }
  
  
}

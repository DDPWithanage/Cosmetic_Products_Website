import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from './product.interface';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit{
  productData: Product = {
    product_id: '',
    product_name: '',
    product_category: '',
    product_description: '',
    directions: '',
    price: 0,
    in_stock: 0,
    image_filename: ''
  };
  selectedFile: File | null = null;
  successMessage: string | null = null;
  
  constructor(private productService: ProductService) { 
    this.productData = {
      product_id: '', 
      product_name: '',
      product_category: '',
      product_description: '',
      directions: '',
      price: 0,
      in_stock: 0,
      image_filename: ''
    };

  }

  ngOnInit(): void {
   
  }
  
  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      this.selectedFile = inputElement.files[0];
    }
  }
  
  // onFileSelected(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   if (inputElement?.files?.length) {
  //     this.selectedFile = inputElement.files[0];
  
  //     // Modify the image path here
  //     const imagePath = 'images/' + this.selectedFile.name;
  //     this.productData.image_filename = imagePath;
  //     console.log(imagePath);
  //   }
  // }
  

  onSubmit() {
    console.log('Form Data:', this.productData);
    const formData = new FormData();
    formData.append('product_id', this.productData.product_id);
    formData.append('product_name', this.productData.product_name);
    formData.append('product_category', this.productData.product_category);
    formData.append('product_description', this.productData.product_description);
    formData.append('directions', this.productData.directions);
    formData.append('price', String(this.productData.price));
    formData.append('in_stock', String(this.productData.in_stock));

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.productService.createProduct(formData).subscribe(
      (response) => {
        this.successMessage = 'Product created successfully';
        this.clearForm();
      },
      (error) => {
        console.error('Error creating product', error);
      }
    );
  }

  clearForm() {
    this.productData = {
      product_id: '',
      product_name: '',
      product_category: '',
      product_description: '',
      directions: '',
      price: 0,
      in_stock: 0,
      image_filename: ''
    };
    this.selectedFile = null;
  }

 
  }

  


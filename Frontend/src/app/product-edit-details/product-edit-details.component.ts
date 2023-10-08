import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-edit-details',
  templateUrl: './product-edit-details.component.html',
  styleUrls: ['./product-edit-details.component.scss']
})
export class ProductEditDetailsComponent implements OnInit {
  productData: any = {
    product_id: '',
    product_name: '',
    product_category: '',
    product_description: '',
    directions: '',
    price: 0,
    in_stock: 0,
    image_filename: ''
  };
  successMessage: string | null = null;

  constructor(private productService: ProductService, private route: ActivatedRoute){

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const product_uniqueId = params.get('product_uniqueId')!;
      this.productService.getProductDetails(product_uniqueId).subscribe((result: any) => {
        // Populate the productData object with the retrieved data
        this.productData = result;
      });
    });
  }

  onSubmit() {
    const product_uniqueId = this.productData.product_uniqueId;
    this.productService.updateProduct(product_uniqueId, this.productData).subscribe(
      (response) => {
        this.successMessage = 'Product updated successfully';
        // Reset the form data after successful submission
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
      },
      (error) => {
        console.error('Error updating product', error);
      }
    );
  }

  // onFileSelected(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   if (inputElement?.files?.length) {
  //     const selectedFile = inputElement.files[0];
  //     this.productData.image_filename = selectedFile.name;
  //   }
  // }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files?.length) {
      const selectedFile = inputElement.files[0];
      this.uploadImage(selectedFile);
    }
  }
  
  // private uploadImage(file: File) {
  //   const formData = new FormData();
  //   formData.append('image', file);
  
  //   this.productService.uploadImage(formData).subscribe(
  //     (response: any) => {
  //       this.productData.image_filename = file.name;
  //       this.productData.image_path = response.image_path;
  //     },
  //     (error) => {
  //       console.error('Error uploading image', error);
  //     }
  //   );
  // }

  private uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
  
    this.productService.uploadImage(formData).subscribe(
      (response: any) => {
        this.productData.image_filename = file.name;
  
        const imagePath = 'images/' + response.image_path.substring(response.image_path.lastIndexOf('/') + 1);
        this.productData.image_path = imagePath;
        //console.log(imagePath);
      },
      (error) => {
        console.error('Error uploading image', error);
      }
    );
  }
  

}

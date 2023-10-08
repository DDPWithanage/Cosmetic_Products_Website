import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  product: any;

  constructor(private route: ActivatedRoute, private productService: ProductService, private router: Router) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const product_uniqueId = params.get('product_uniqueId')!;
      this.productService.getProductDetails(product_uniqueId).subscribe((result: any) => {
        this.product = result;
      });
    });
  }

  // Method to navigate data to the edit page
  navigateToEditProduct(product_uniqueId: string): void {
    this.router.navigate(['/editProduct', product_uniqueId]);
  }

}

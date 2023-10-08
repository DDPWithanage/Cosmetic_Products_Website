import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  productList: any[] = [];
  currentPage = 0;
  pageSize = 10;

  constructor(private productService: ProductService, private router: Router){

  }
  ngOnInit(): void {
    this.loadAllProducts();
  }

  //fetching data that returns from getAllProducts Method
  loadAllProducts(){
    this.productService.getAllProducts(this.currentPage, this.pageSize).subscribe((result: any) => {
      this.productList = result;
      console.log(this.productList);
      console.log(this.productList.length);
    },
    (error) => {
      console.error(error);
    });
  }

  handlePageEvent(pageEvent: PageEvent){
    console.log('handlePageEvent', pageEvent);
    this.currentPage = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize; 
    this.loadAllProducts();
  }

  navigateToProductDetails(product_uniqueId: string): void {
    console.log(`Navigating to product details for ${product_uniqueId}`);
    this.router.navigate(['/productDetails', product_uniqueId]);
  }

  deleteProduct(productId: string) {
    this.productService.deleteProduct(productId).subscribe(
      () => {
        // Remove the product from your local list
        this.productList = this.productList.filter(product => product.product_uniqueId !== productId);
        console.log('Product deleted successfully');
      },
      error => {
        console.error('Error deleting product', error);
      }
    );
  }
  
}

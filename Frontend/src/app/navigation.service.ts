import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }

  // goToProductDetails(product_uniqueId: string) {
  //   this.router.navigate(['/productDetails', product_uniqueId]);
  // }
}

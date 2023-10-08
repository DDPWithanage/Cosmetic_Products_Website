import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { ProductComponent } from './product/product.component';
import { ProductEditDetailsComponent } from './product-edit-details/product-edit-details.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

const routes: Routes = [
  {
    path:'products',
    component: HomeComponent
  },
  {
    path: '', // Empty path will redirect to products
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'productDetails/:product_uniqueId',
    component: ProductDetailsComponent
  },
  {
    path: 'newProduct',
    component: ProductComponent
  },
  {
    path: 'editProduct/:product_uniqueId',
    component: ProductEditDetailsComponent
  },
  {
    path: 'contactUs',
    component: ContactUsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

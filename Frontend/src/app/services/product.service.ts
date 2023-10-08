import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getAllProducts(page: number, pageSize: number): Observable<any[]>{
    return this.http.get<any[]>(`http://localhost:8080/api/products?page=${page}&pageSize=${pageSize}`);
  }

  getProductDetails(product_uniqueId: string) {
    return this.http.get(`http://localhost:8080/api/products/${product_uniqueId}`);
  }

  createProduct(formData: FormData): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/api/products`, formData);
  }

  deleteProduct(product_uniqueId: string): Observable<any> {
    return this.http.delete(`http://localhost:8080/api/products/delete/${product_uniqueId}`);
  }

  updateProduct(product_uniqueId: string, updatedProductData: any) {
    return this.http.put(`http://localhost:8080/api/products/edit/${product_uniqueId}`, updatedProductData);
  }

  uploadImage(formData: FormData) {
    return this.http.post(`http://localhost:8080/api/products/updateImage`, formData);
  }
  
  
}

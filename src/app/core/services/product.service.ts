import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import type { Product, ProductCategory } from '../../pages/menu/menu.models';

interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  image_url: string;
  category_id: ProductCategory;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http
      .get<ApiProduct[]>('http://localhost:8000/products', {
        params: { skip: 0, limit: 100 },
      })
      .pipe(
        map((products) =>
          products.map((product) => ({
            id: String(product.id),
            name: product.name,
            description: product.description,
            category: product.category_id,
            price: product.price,
            rating: product.rating.toLocaleString('pt-BR', {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            }),
            image: product.image_url,
          })),
        ),
      );
  }
}

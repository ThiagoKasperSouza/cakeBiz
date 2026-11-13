import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { CATEGORIES } from './menu.models';
import type { CategoryId, Product } from './menu.models';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-menu',
  styleUrl: './menu.css',
  templateUrl: './menu.html',
})
export class Menu {
  private readonly order = inject(OrderService);
  private readonly productService = inject(ProductService);

  protected readonly categories = CATEGORIES;
  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly selectedCategory = signal<CategoryId>('all');
  protected readonly filteredProducts = computed(() => {
    const category = this.selectedCategory();
    const products = this.products();
    return category === 'all' ? products : products.filter((product) => product.category === category);
  });

  constructor() {
    afterNextRender(() => this.loadProducts());
  }

  protected loadProducts(): void {
    this.loading.set(true);
    this.error.set(false);

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  protected selectCategory(category: CategoryId): void {
    this.selectedCategory.set(category);
  }

  protected addToCart(product: Product): void {
    this.order.add(product);
  }
}

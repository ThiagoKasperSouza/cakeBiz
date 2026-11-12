import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { CATEGORIES, PRODUCTS } from './menu.models';
import type { CategoryId, Product } from './menu.models';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-menu',
  styleUrl: './menu.css',
  templateUrl: './menu.html',
})
export class Menu {
  private readonly order = inject(OrderService);

  protected readonly categories = CATEGORIES;
  protected readonly selectedCategory = signal<CategoryId>('all');
  protected readonly filteredProducts = computed(() => {
    const category = this.selectedCategory();
    return category === 'all' ? PRODUCTS : PRODUCTS.filter((product) => product.category === category);
  });

  protected selectCategory(category: CategoryId): void {
    this.selectedCategory.set(category);
  }

  protected addToCart(product: Product): void {
    this.order.add(product);
  }
}

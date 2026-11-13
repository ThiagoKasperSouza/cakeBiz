import { computed, Injectable, signal } from '@angular/core';
import type { CartLine, Product } from '../../pages/menu/menu.models';

const WHATSAPP_NUMBER = '5500000000000';

@Injectable({ providedIn: 'root' })
export class OrderService {
  readonly cart = signal<CartLine[]>([]);
  readonly cartCount = computed(() => this.cart().reduce((total, line) => total + line.quantity, 0));
  readonly cartTotal = computed(() =>
    this.cart().reduce((total, line) => total + line.product.price * line.quantity, 0),
  );
  readonly whatsappCheckoutUrl = computed(() => {
    const formatCurrency = (value: number) =>
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    const items = this.cart()
      .map(({ product, quantity }) => `• ${quantity}x ${product.name} — ${formatCurrency(product.price * quantity)}`)
      .join('\n');
    const message = [
      'Olá, Delizia! Quero finalizar este pedido:',
      items,
      `Total: ${formatCurrency(this.cartTotal())}`,
      '',
      'Gostaria de combinar a retirada ou a entrega. Quais são as opções e horários disponíveis?',
    ].join('\n');

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  });
  readonly whatsappSpecialOrderUrl = computed(() => {
    const message = 'Olá, Delizia! Gostaria de conversar sobre uma encomenda especial.';
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  });

  add(product: Product): void {
    this.cart.update((items) => {
      const existing = items.find((item) => item.product.id === product.id);
      return existing
        ? items.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...items, { product, quantity: 1 }];
    });
  }

  removeOne(product: Product): void {
    this.cart.update((items) =>
      items
        .map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  clear(): void {
    this.cart.set([]);
  }
}

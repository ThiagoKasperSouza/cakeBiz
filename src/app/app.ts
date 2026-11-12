import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AssistantService } from './core/services/assistant.service';
import { OrderService } from './core/services/order.service';

type MessageRole = 'assistant' | 'user';

interface ChatMessage {
  id: number;
  role: MessageRole;
  content: string;
}

@Component({
  imports: [CurrencyPipe, FormsModule, RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly assistant = inject(AssistantService);
  protected readonly order = inject(OrderService);

  protected readonly messages = signal<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Sou sua assistente Delizia. Me conta: o que você gostaria de pedir hoje?',
    },
  ]);
  protected readonly draft = signal('');
  protected readonly isSending = signal(false);
  protected readonly assistantOpen = signal(true);
  private readonly conversationId = signal<string | null>(null);
  private nextMessageId = 2;

  protected sendMessage(): void {
    const message = this.draft().trim();
    if (!message || this.isSending()) return;

    this.draft.set('');
    this.messages.update((items) => [...items, { id: this.nextMessageId++, role: 'user', content: message }]);
    this.isSending.set(true);

    this.assistant
      .sendMessage({
        message,
        conversation_id: this.conversationId(),
        items: this.order.cart().map(({ product, quantity }) => ({
          product_id: product.id,
          name: product.name,
          quantity,
          unit_price: product.price,
        })),
      })
      .subscribe({
        next: (response) => {
          this.conversationId.set(response.conversation_id ?? this.conversationId());
          this.messages.update((items) => [...items, { id: this.nextMessageId++, role: 'assistant', content: response.reply }]);
          this.isSending.set(false);
        },
        error: () => {
          this.messages.update((items) => [
            ...items,
            {
              id: this.nextMessageId++,
              role: 'assistant',
              content: 'Não consegui falar com o assistente agora. Tente novamente mais tarde.',
            },
          ]);
          this.isSending.set(false);
        },
      });
  }

  protected askSuggestion(message: string): void {
    this.draft.set(message);
    this.sendMessage();
  }

  protected toggleAssistant(): void {
    this.assistantOpen.update((open) => !open);
  }

  protected scrollToOrder(): void {
    this.assistantOpen.set(true);
    document.getElementById('pedido')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

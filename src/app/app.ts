import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { OrderService } from './core/services/order.service';

type MessageRole = 'assistant' | 'user';
type ChatFlow = 'recommendation' | 'special-order';

interface ChatMessage {
  id: number;
  role: MessageRole;
  content: string;
  action?: {
    kind: 'internal' | 'external';
    label: string;
    target: string;
  };
}

@Component({
  imports: [CurrencyPipe, RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly order = inject(OrderService);

  protected readonly messages = signal<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Olá! Escolha uma opção para conhecer o cardápio ou falar sobre uma encomenda especial.',
    },
  ]);
  protected readonly assistantOpen = signal(true);
  private nextMessageId = 2;

  protected chooseFlow(flow: ChatFlow): void {
    const transitions: Record<ChatFlow, { question: string; reply: string; action: ChatMessage['action'] }> = {
      recommendation: {
        question: 'Qual bolo você recomenda?',
        reply: 'Temos opções deliciosas no nosso cardápio. Explore os bolos e escolha o seu favorito:',
        action: { kind: 'internal', label: 'Ver cardápio', target: '/menu' },
      },
      'special-order': {
        question: 'Quero fazer uma encomenda especial.',
        reply: 'Para combinar os detalhes da sua encomenda especial, fale com a gente pelo WhatsApp:',
        action: {
          kind: 'external',
          label: 'Conversar pelo WhatsApp',
          target: this.order.whatsappSpecialOrderUrl(),
        },
      },
    };
    const transition = transitions[flow];

    this.messages.update((items) => [
      ...items,
      { id: this.nextMessageId++, role: 'user', content: transition.question },
      {
        id: this.nextMessageId++,
        role: 'assistant',
        content: transition.reply,
        action: transition.action,
      },
    ]);
  }

  protected toggleAssistant(): void {
    this.assistantOpen.update((open) => !open);
  }

  protected scrollToOrder(): void {
    this.assistantOpen.set(true);
    document.getElementById('pedido')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

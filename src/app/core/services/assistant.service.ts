import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AssistantChatRequest {
  message: string;
  conversation_id: string | null;
  items: Array<{
    product_id: string;
    name: string;
    quantity: number;
    unit_price: number;
  }>;
}

export interface AssistantChatResponse {
  reply: string;
  conversation_id?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AssistantService {
  private readonly http = inject(HttpClient);

  sendMessage(request: AssistantChatRequest): Observable<AssistantChatResponse> {
    return this.http.post<AssistantChatResponse>('/api/assistant/chat', request);
  }
}

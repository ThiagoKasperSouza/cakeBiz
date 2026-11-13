# Delizia

Vitrine responsiva de confeitaria artesanal, feita em Angular. Inclui cardápio por categoria, carrinho e uma interface de conversa preparada para um backend Python com Pinecone Assistant.

## Executar

```bash
npm install
npm start
```

O app fica disponível em `http://localhost:4200`.

## API de produtos

No desenvolvimento, o cardápio carrega os produtos com `GET /api/products?skip=0&limit=100`.
O servidor Angular encaminha essa rota para `http://localhost:8000/products`, evitando CORS
entre o navegador e a API local. Em produção, configure um proxy equivalente no servidor web
ou habilite CORS no backend para a origem do frontend.

Cada produto deve incluir `id`, `name`, `description`, `price`, `rating`, `image_url` e
`category_id` (`cakes`, `cupcakes`, `cookies` ou `coffee`).

## Páginas

Cada aba da navegação é uma página standalone em `src/app/pages`, registrada em `src/app/app.routes.ts`. A página inicial fica em `pages/home`; o cardápio e seus filtros ficam em `pages/menu`. Os serviços compartilhados ficam em `src/app/core/services`: `OrderService` mantém o carrinho entre rotas e `AssistantService` integra o chat com a API.

## API do assistente

O frontend envia mensagens para `POST /api/assistant/chat`. Configure o backend Python (ou um proxy de desenvolvimento) para atender essa rota; o navegador não deve receber chaves do Pinecone.

Corpo enviado:

```json
{
  "message": "Quais são os bolos mais pedidos?",
  "conversation_id": null,
  "items": [
    {
      "product_id": "chocolate-dream",
      "name": "Chocolate dos Sonhos",
      "quantity": 1,
      "unit_price": 89.9
    }
  ]
}
```

Resposta esperada:

```json
{
  "reply": "O Chocolate dos Sonhos é o nosso mais pedido!",
  "conversation_id": "id-da-conversa"
}
```

O serviço Python deve manter o identificador de conversa do Pinecone, chamar o assistente e devolver a resposta neste formato. Sem a API disponível, o chat informa que não conseguiu conectar; o catálogo e o carrinho continuam funcionando localmente.

## Finalizar pedido pelo WhatsApp

O botão de checkout abre um link `wa.me` com os itens e o total do carrinho em uma mensagem pré-preenchida. O cliente confirma o envio no próprio WhatsApp e combina por lá a retirada ou a entrega.

O número atual é fictício (`+55 (00) 00000-0000`) e serve apenas como demonstração. Antes de publicar, substitua `WHATSAPP_NUMBER` em `src/app/core/services/order.service.ts` por um número real com código do país e somente dígitos, sem `+`, espaços ou pontuação. A mensagem é preparada no frontend; o app não envia mensagens automaticamente.

export type CategoryId = 'all' | 'cakes' | 'cupcakes' | 'cookies' | 'coffee';
export type ProductCategory = Exclude<CategoryId, 'all'>;

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  rating: string;
  image: string;
  badge?: string;
}

export interface CartLine {
  product: Product;
  quantity: number;
}

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'Tudo', icon: '✳' },
  { id: 'cakes', label: 'Bolos', icon: '▰' },
  { id: 'cupcakes', label: 'Cupcakes', icon: '♧' },
  { id: 'cookies', label: 'Cookies', icon: '◉' },
  { id: 'coffee', label: 'Cafés', icon: '♨' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'chocolate-dream',
    name: 'Chocolate dos Sonhos',
    description: 'Bolo de chocolate intenso com ganache aveludada.',
    category: 'cakes',
    price: 89.9,
    rating: '4,9',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85',
    badge: 'Mais pedido',
  },
  {
    id: 'berry-bliss',
    name: 'Delícia de Frutas Vermelhas',
    description: 'Cheesecake cremoso com frutas frescas.',
    category: 'cakes',
    price: 79.9,
    rating: '4,8',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=85',
    badge: 'Novidade',
  },
  {
    id: 'carrot-delight',
    name: 'Delícia de Cenoura',
    description: 'Bolo de cenoura com cobertura cremosa.',
    category: 'cakes',
    price: 69.9,
    rating: '4,9',
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'vanilla-cupcake',
    name: 'Cupcake de Baunilha',
    description: 'Massa fofinha, baunilha e cobertura artesanal.',
    category: 'cupcakes',
    price: 14.9,
    rating: '4,8',
    image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=800&q=85',
    badge: 'Favorito',
  },
  {
    id: 'chocolate-cookie',
    name: 'Cookie com Chocolate',
    description: 'Casquinha crocante e centro macio.',
    category: 'cookies',
    price: 9.9,
    rating: '4,9',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino da Casa',
    description: 'Café espresso, leite cremoso e canela.',
    category: 'coffee',
    price: 12.9,
    rating: '4,7',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=85',
  },
];

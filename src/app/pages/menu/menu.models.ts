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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { OrderService } from '../../core/services/order.service';
import { Menu } from './menu';

describe('Menu', () => {
  let component: Menu;
  let fixture: ComponentFixture<Menu>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menu],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Menu);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpTesting.expectOne(
      (request) =>
        request.url === 'http://localhost:8000/products' &&
        request.params.get('skip') === '0' &&
        request.params.get('limit') === '100',
    ).flush([
      {
        id: 1,
        name: 'Chocolate dos Sonhos',
        description: 'Bolo de chocolate intenso com ganache aveludada.',
        price: 89.9,
        rating: 4.9,
        image_url: 'https://example.com/chocolate.jpg',
        category_id: 'cakes',
      },
      {
        id: 2,
        name: 'Cupcake de Baunilha',
        description: 'Massa fofinha, baunilha e cobertura artesanal.',
        price: 14.9,
        rating: 4.8,
        image_url: 'https://example.com/cupcake.jpg',
        category_id: 'cupcakes',
      },
    ]);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => httpTesting.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters products by category and adds a product to the shared order', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.product-card').length).toBe(2);

    const cakesButton = Array.from(
      compiled.querySelectorAll<HTMLButtonElement>('.category-chip'),
    ).find((button) => button.textContent?.includes('Bolos'));
    cakesButton?.click();
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.product-card').length).toBe(1);

    compiled.querySelector<HTMLButtonElement>('.add-button')?.click();
    const order = TestBed.inject(OrderService);
    expect(order.cartCount()).toBe(1);
    expect(order.cart()[0].product.name).toBe('Chocolate dos Sonhos');
    expect(order.cart()[0].product.id).toBe('1');
  });
});

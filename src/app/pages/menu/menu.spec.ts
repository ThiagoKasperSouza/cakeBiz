import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderService } from '../../core/services/order.service';
import { Menu } from './menu';

describe('Menu', () => {
  let component: Menu;
  let fixture: ComponentFixture<Menu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menu],
    }).compileComponents();

    fixture = TestBed.createComponent(Menu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters products by category and adds a product to the shared order', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.product-card').length).toBe(6);

    const cakesButton = Array.from(
      compiled.querySelectorAll<HTMLButtonElement>('.category-chip'),
    ).find((button) => button.textContent?.includes('Bolos'));
    cakesButton?.click();
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.product-card').length).toBe(3);

    compiled.querySelector<HTMLButtonElement>('.add-button')?.click();
    const order = TestBed.inject(OrderService);
    expect(order.cartCount()).toBe(1);
    expect(order.cart()[0].product.name).toBe('Chocolate dos Sonhos');
  });
});

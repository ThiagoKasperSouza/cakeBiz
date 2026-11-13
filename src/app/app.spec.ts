import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter(routes)],
    })
      .compileComponents();
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('offers only predefined chat flows', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.chat-composer')).toBeNull();
    expect(compiled.querySelectorAll('.suggestions button').length).toBe(2);
  });

  it('recommends the menu and forwards special orders to WhatsApp', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const recommendation = Array.from(compiled.querySelectorAll<HTMLButtonElement>('.suggestions button'))
      .find((button) => button.textContent?.includes('recomendam'));
    recommendation?.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.message-action[href="/menu"]')?.textContent).toContain('Ver cardápio');

    const specialOrder = Array.from(compiled.querySelectorAll<HTMLButtonElement>('.suggestions button'))
      .find((button) => button.textContent?.includes('encomenda especial'));
    specialOrder?.click();
    fixture.detectChanges();
    const whatsappLink = compiled.querySelector<HTMLAnchorElement>('.message-action[href^="https://wa.me/"]');
    expect(whatsappLink?.getAttribute('href')).toContain('Gostaria%20de%20conversar%20sobre%20uma%20encomenda%20especial');
    expect(whatsappLink?.target).toBe('_blank');
  });

  it('should keep the shared shell and navigate between pages with a persistent cart', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.assistant-panel h2')?.textContent).toContain('Atendimento Delizia');

    const router = TestBed.inject(Router);
    await router.navigateByUrl('/menu');
    fixture.detectChanges();
    const httpTesting = TestBed.inject(HttpTestingController);
    httpTesting.expectOne(
      (request) => request.url === '/api/products' && request.params.get('limit') === '100',
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
    ]);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.product-card').length).toBe(1);

    compiled.querySelector<HTMLButtonElement>('.add-button')?.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.cart-count')?.textContent).toContain('1');

    const checkoutLink = compiled.querySelector<HTMLAnchorElement>('.checkout-button');
    expect(checkoutLink?.getAttribute('href')).toContain('https://wa.me/5500000000000?text=');
    expect(checkoutLink?.target).toBe('_blank');
    expect(checkoutLink?.rel).toContain('noopener');
    const checkoutMessage = new URL(checkoutLink!.href).searchParams.get('text') ?? '';
    expect(checkoutMessage).toContain('1x Chocolate dos Sonhos');
    expect(checkoutMessage).toContain('Total: R$ 89,90');
    expect(checkoutMessage).toContain('retirada ou a entrega');

    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(compiled.querySelector('h1')?.textContent).toContain('muito amor.');
    expect(compiled.querySelector('.cart-count')?.textContent).toContain('1');

    compiled.querySelector<HTMLButtonElement>('.close-chat')?.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.assistant-panel')).toBeNull();
    compiled.querySelector<HTMLButtonElement>('.assistant-launcher')?.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.assistant-panel')).not.toBeNull();
  });
});

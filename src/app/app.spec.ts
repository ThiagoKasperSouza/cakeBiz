import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideRouter(routes)],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should keep the shared shell and navigate between pages with a persistent cart', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.assistant-panel h2')?.textContent).toContain('Assistente Delizia');

    const router = TestBed.inject(Router);
    await router.navigateByUrl('/menu');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(compiled.querySelectorAll('.product-card').length).toBe(6);

    compiled.querySelector<HTMLButtonElement>('.add-button')?.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.cart-count')?.textContent).toContain('1');

    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(compiled.querySelector('h1')?.textContent).toContain('muito amor.');
    expect(compiled.querySelector('.cart-count')?.textContent).toContain('1');

    await router.navigateByUrl('/menu');
    fixture.detectChanges();
    await fixture.whenStable();
    const checkoutLink = compiled.querySelector<HTMLAnchorElement>('.checkout-button');
    expect(checkoutLink?.getAttribute('href')).toContain('https://wa.me/5500000000000?text=');
    expect(checkoutLink?.target).toBe('_blank');
    expect(checkoutLink?.rel).toContain('noopener');
    const checkoutMessage = new URL(checkoutLink!.href).searchParams.get('text') ?? '';
    expect(checkoutMessage).toContain('1x Chocolate dos Sonhos');
    expect(checkoutMessage).toContain('Total: R$ 89,90');
    expect(checkoutMessage).toContain('retirada ou a entrega');

    compiled.querySelector<HTMLButtonElement>('.close-chat')?.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.assistant-panel')).toBeNull();
    compiled.querySelector<HTMLButtonElement>('.assistant-launcher')?.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.assistant-panel')).not.toBeNull();
  });
});

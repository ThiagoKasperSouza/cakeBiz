import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('links to the menu page', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector<HTMLAnchorElement>('.home-hero__cta');
    expect(link?.getAttribute('href')).toBe('/menu');
  });

  it('shows the designed hero content and an accessible image', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.home-hero__top-wave')).not.toBeNull();
    expect(compiled.querySelector('.home-hero__bottom-wave')).not.toBeNull();
    expect(compiled.querySelector('#home-photo-clip path')).not.toBeNull();
    expect(compiled.querySelector('.home-hero__copy h1')?.textContent).toContain('muito amor.');
    expect(compiled.querySelector('.home-hero__image')?.getAttribute('alt')).toContain(
      'Bolo artesanal',
    );
    expect(compiled.querySelector('.home-hero__cta')?.textContent).toContain(
      'Conheça nosso cardápio',
    );
  });
});

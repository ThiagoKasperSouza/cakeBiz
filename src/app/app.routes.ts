import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Menu } from './pages/menu/menu';

export const routes: Routes = [
  { path: '', component: Home, title: 'Delizia — início' },
  { path: 'menu', component: Menu, title: 'Delizia — cardápio' },
  { path: '**', redirectTo: '' },
];

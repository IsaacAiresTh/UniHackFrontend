
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // página inicial
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  {path: 'desafios', loadComponent: () => import('./pages/desafios/desafios.component').then(m => m.DesafiosComponent)},
  // Adicione outras rotas conforme necessário
];
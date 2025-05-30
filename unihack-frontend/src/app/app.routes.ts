import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // página inicial
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'cadastro', loadComponent: () => import('./auth/cadastro/cadastro.component').then(m => m.CadastroComponent) }
    ]
  },
  { path: 'desafios', loadComponent: () => import('./pages/desafios/desafios.component').then(m => m.DesafiosComponent) },
  { path: 'ranking', loadComponent: () => import('./pages/ranking/ranking.component').then(m => m.RankingComponent) }, 
  {path: 'desafios/:id', loadComponent: () => import('./pages/desafio-detalhe/desafio-detalhe.component').then(m => m.DesafioDetalheComponent)},
  // Rota curinga para página não encontrada
  { path: '**', redirectTo: '' }
];
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', component: HomeComponent }, // página inicial
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
];

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  isAuthenticated(): boolean {
    // Aqui você pode verificar se existe um token no localStorage, por exemplo
    return !!localStorage.getItem('token');
  }

  // Exemplo de login (você vai implementar isso depois)
  login(token: string): void {
    localStorage.setItem('token', token);
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}

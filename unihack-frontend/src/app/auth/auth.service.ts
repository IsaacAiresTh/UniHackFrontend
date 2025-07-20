// src/app/auth/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment'; // Certifique-se que o caminho está correto
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl; // Usando a variável de ambiente
  private tokenKey = 'authToken';

  constructor(private http: HttpClient, private router: Router) { }


  // ****** ALTERAÇÃO APLICADA AQUI ******
  // O método agora espera um único objeto userData com os campos corretos para o backend.
  register(userData: { name: string; matricula: string; password: string; confirmPassword: string; }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  login(matricula: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { matricula,  password})
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.saveToken(response.token);
          }
        }),
        catchError(this.handleError)
      );
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    // Verifica se o token existe no localStorage
    return !!localStorage.getItem('authToken');
  }

  logout(): void {
    // Remove o token do localStorage
    localStorage.removeItem('authToken');
    // Opcional: Redireciona o usuário para a página de login ou inicial
    this.router.navigate(['/login']);
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocorreu um erro!', error); // Este é o log que você está vendo no console do navegador
    return throwError(() => new Error(error.error?.message || error.message || 'Erro desconhecido do servidor'));
  }
}
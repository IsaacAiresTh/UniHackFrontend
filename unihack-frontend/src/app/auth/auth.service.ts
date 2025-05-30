// src/app/core/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Importe HttpClient e HttpHeaders
import { Observable, BehaviorSubject, tap } from 'rxjs';
// Defina interfaces para os dados de payload e resposta, se desejar
// import { User, AuthResponse, RegisterPayload } from '../models/auth.model'; // Crie este arquivo se necessário

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // ATENÇÃO: Mova esta URL para os arquivos de environment (environment.ts e environment.development.ts)
  private apiUrl = 'http://localhost:8080/api/auth'; // Exemplo de URL base do seu backend. AJUSTE CONFORME NECESSÁRIO!

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) { } // Injete HttpClient

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Exemplo de método de login (você pode já ter algo similar)
  login(credentials: any): Observable<any> { // Substitua 'any' por uma interface de resposta apropriada
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) { // Assumindo que o backend retorna um token
          localStorage.setItem('authToken', response.token);
          this.loggedIn.next(true);
        }
      })
    );
  }

  // NOVO MÉTODO DE REGISTRO
  register(userData: any): Observable<any> { // Substitua 'any' por interfaces de payload e resposta
    // Exemplo de endpoint: /api/auth/register ou /api/usuarios
    // userData deve ser um objeto com os campos esperados pelo seu backend
    // (ex: nome, email, senha)
    return this.http.post<any>(`${this.apiUrl}/register`, userData, { // AJUSTE O ENDPOINT '/register' SE NECESSÁRIO
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.loggedIn.next(false);
    // Aqui você pode querer redirecionar para a página de login
    // this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
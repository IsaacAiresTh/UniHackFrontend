import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

interface User {
  id: string;
  nome: string;
  matricula: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    // Verificar se já existe um usuário no localStorage ao iniciar o serviço
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(true);
    }
  }

  // Método de login (simulado para demonstração)
  login(matricula: string, password: string): Observable<User> {
    // Simula uma requisição a API
    const mockUser: User = {
      id: '1',
      nome: 'Estudante Hacker',
      matricula: matricula,
      token: 'fake-jwt-token.fake-jwt-token.fake-jwt-token'
    };

    // Retorna um Observable simulando delay de rede
    return of(mockUser).pipe(
      delay(1500),
      tap(user => {
        // Guardar usuário no localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);
      })
    );
  }

  // Método de cadastro (simulado para demonstração)
  register(nome: string, matricula: string, password: string): Observable<User> {
    // Simula uma requisição a API
    const mockUser: User = {
      id: '1',
      nome: nome,
      matricula: matricula,
      token: 'fake-jwt-token.fake-jwt-token.fake-jwt-token'
    };

    // Retorna um Observable simulando delay de rede
    return of(mockUser).pipe(
      delay(1500)
    );
  }

  // Método de logout
  logout(): void {
    // Remover usuário do localStorage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  // Retorna o usuário atual
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Verifica se o usuário está autenticado
  get isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
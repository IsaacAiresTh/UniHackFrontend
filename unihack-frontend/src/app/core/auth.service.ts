import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  // ESTE É O ÚNICO CONSTRUTOR NECESSÁRIO
  constructor(private http: HttpClient, private router: Router) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
        }
      })
    );
  }

  // MÉTODO PARA VERIFICAR SE ESTÁ LOGADO
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // MÉTODO PARA FAZER LOGOUT
  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']); // Redireciona para a página de login
  }
}
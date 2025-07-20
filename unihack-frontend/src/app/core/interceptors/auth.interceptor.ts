import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
// import { AuthService } from '../auth/auth.service'; // Importe o AuthService

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // É uma boa prática injetar o serviço de autenticação para pegar a chave do token,
  // mas para simplificar, vamos usar o nome da chave diretamente.
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // CORREÇÃO: Pega o token usando a chave correta: 'authToken'
    const token = localStorage.getItem('authToken');

    // Se o token existir, clona a requisição e adiciona o cabeçalho
    if (token) {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });
      // Envia a requisição clonada com o cabeçalho
      return next.handle(cloned);
    }

    // Se não houver token, envia a requisição original
    return next.handle(request);
  }
}
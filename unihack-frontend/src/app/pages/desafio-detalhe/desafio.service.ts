// desafio.service.ts (exemplo)
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators'; // Para simular latência da API

export interface DetalhesDesafio {
  id: string;
  titulo: string;
  explicacaoVulnerabilidade: string;
  // outros campos como dicas, ambiente de configuração, etc.
}

// Dados mockados - substitua por uma chamada de API real
const TODOS_DESAFIOS: DetalhesDesafio[] = [
  { id: 'sql-injection-1', titulo: 'SQL Injection Básico', explicacaoVulnerabilidade: 'SQL Injection é uma técnica que explora falhas de segurança em aplicações web que interagem com bases de dados SQL...' },
  { id: 'xss-basico-1', titulo: 'Cross-Site Scripting (XSS) - Refletido', explicacaoVulnerabilidade: 'XSS Refletido ocorre quando um script malicioso é injetado em uma URL e refletido de volta para o usuário...' },
  // ... mais desafios
];

@Injectable()
export class DesafioService {
  constructor() { }

  getDetalhesDesafio(id: string): Observable<DetalhesDesafio> {
    const desafioEncontrado = TODOS_DESAFIOS.find(d => d.id === id);
    if (desafioEncontrado) {
      return of(desafioEncontrado).pipe(delay(500)); // Simula uma pequena espera
    } else {
      return throwError(() => new Error('Desafio não encontrado'));
    }
  }
}
// src/app/core/services/api.service.ts (exemplo de caminho)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Seus modelos de dados (interfaces)
export interface Desafio {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  score: number;
  dockerImage: string; // Importante, vindo do backend
}

export interface ActiveChallengeSession {
  containerId: string;
  accessUrl: string;
}

export interface RankingUser {
  id: string;
  username: string;
  matricula: string;
  role: 'ADMIN' | 'USER';
  points: number;
}

const API_BASE_URL = 'http://localhost:8080'; // A URL do seu backend

@Injectable({
  providedIn: 'root' // Fornecido para toda a aplicação
})
export class ApiService {

  constructor(private http: HttpClient) { }

  // 1. Busca a lista de desafios do backend
  getAllChallenges(): Observable<Desafio[]> {
    // NOTE: O endpoint no seu backend é /challenges/all
    return this.http.get<Desafio[]>(`${API_BASE_URL}/challenges/all`);
  }

  // 2. Busca os detalhes de UM desafio específico
  getChallengeDetails(id: string): Observable<Desafio> {
    // NOTE: O endpoint no seu backend é /challenges/details/{id}
    return this.http.get<Desafio>(`${API_BASE_URL}/challenges/details/${id}`);
  }

  // 3. Pede para o backend iniciar um desafio
  startChallenge(id: string): Observable<ActiveChallengeSession> {
    // NOTE: O endpoint no seu backend é /challenges/{id}/start
    return this.http.post<ActiveChallengeSession>(`${API_BASE_URL}/challenges/${id}/start`, {});
  }

  // 4. Pede para o backend parar um desafio (e validar a flag)
  // (Este é o próximo passo, mas já vamos deixar o método pronto)
  submitFlag(containerId: string, flag: string): Observable<any> {
    const payload = { containerId, flag };
    return this.http.post(`${API_BASE_URL}/challenges/submit`, payload);
  }

  getRanking(): Observable<RankingUser[]> {
  return this.http.get<RankingUser[]>(`${API_BASE_URL}/users/ranking`);
}

}
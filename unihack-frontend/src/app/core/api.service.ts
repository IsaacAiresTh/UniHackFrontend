// src/app/core/services/api.service.ts (seu caminho atual)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// SUAS INTERFACES EXISTENTES
export interface Desafio {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  score: number;
  dockerImage: string;
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

// --- NOVAS INTERFACES PARA O PERFIL ---
export interface UserStats {
  completedChallenges: number;
  totalChallenges: number;
  progressPercentage: number;
  favoriteCategory: string;
}

export interface UserProfile {
  username: string;
  matricula: string;
  points: number;
  stats: UserStats;
}


const API_BASE_URL = 'http://localhost:8080'; // A URL do seu backend

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getAllChallenges(): Observable<Desafio[]> {
    return this.http.get<Desafio[]>(`${API_BASE_URL}/challenges/all`);
  }

  getChallengeDetails(id: string): Observable<Desafio> {
    return this.http.get<Desafio>(`${API_BASE_URL}/challenges/details/${id}`);
  }

  startChallenge(id: string): Observable<ActiveChallengeSession> {
    return this.http.post<ActiveChallengeSession>(`${API_BASE_URL}/challenges/${id}/start`, {});
  }

  getRanking(): Observable<RankingUser[]> {
    // --- ALTERAÇÃO APLICADA AQUI ---
    // A URL foi corrigida para usar o prefixo /api, padronizando com o resto da aplicação.
    return this.http.get<RankingUser[]>(`${API_BASE_URL}/api/users/ranking`);
  }

  submitFlag(containerId: string, flag: string): Observable<any> {
    return this.http.post(`${API_BASE_URL}/challenges/submit`, { containerId, flag });
  }

  getChallengeStatus(id: string): Observable<{ isSolved: boolean }> {
    return this.http.get<{ isSolved: boolean }>(`${API_BASE_URL}/challenges/${id}/status`);
  }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${API_BASE_URL}/api/users/me/profile`);
  }
}
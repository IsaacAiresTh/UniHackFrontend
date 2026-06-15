import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Desafio {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  score: number;
  slug: string;
  category: string | null;
}

export interface RankingUser {
  id: string;
  username: string;
  matricula: string;
  role: 'ADMIN' | 'USER';
  points: number;
}

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

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllChallenges(): Observable<Desafio[]> {
    return this.http.get<Desafio[]>(`${this.base}/challenges/all`);
  }

  getChallengeDetails(id: string): Observable<Desafio> {
    return this.http.get<Desafio>(`${this.base}/challenges/details/${id}`);
  }

  getChallengeStatus(id: string): Observable<{ solved: boolean }> {
    return this.http.get<{ solved: boolean }>(`${this.base}/challenges/${id}/status`);
  }

  submitFlag(flag: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/challenges/submit`, { flag });
  }

  getRanking(): Observable<RankingUser[]> {
    return this.http.get<RankingUser[]>(`${this.base}/users/ranking`);
  }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.base}/users/me`);
  }
}

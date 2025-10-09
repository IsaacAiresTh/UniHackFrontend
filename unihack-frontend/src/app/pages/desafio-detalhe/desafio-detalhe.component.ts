// src/app/pages/desafio-detalhe/desafio-detalhe.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ApiService, Desafio, ActiveChallengeSession } from '../../core/api.service';

@Component({
  selector: 'app-desafio-detalhe',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './desafio-detalhe.component.html',
  styleUrls: ['./desafio-detalhe.component.scss'],
})
export class DesafioDetalheComponent implements OnInit {
  desafio: Desafio | undefined;
  activeChallengeSession: ActiveChallengeSession | null = null;
  isStarting: boolean = false;
  flag: string = '';
  isLoading: boolean = true;
  errorMessage: string | null = null; // Para erros gerais (carregar, iniciar)

  // --- PROPRIEDADES DE ESTADO PARA A SUBMISSÃO ---
  isSubmitting: boolean = false;
  isAlreadySolved: boolean = false;
  submissionMessage: string = '';
  submissionMessageType: 'success' | 'error' | '' = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const desafioId = this.route.snapshot.paramMap.get('id');
    if (desafioId) {
      this.apiService.getChallengeDetails(desafioId).subscribe({
        next: (data) => {
          this.desafio = data;
          this.isLoading = false;

          // ** PONTO CRÍTICO 1: VERIFICAR O STATUS DO DESAFIO **
          // Esta chamada depende de um novo endpoint no seu backend.
          // this.apiService.getChallengeStatus(desafioId).subscribe(status => {
          //   this.isAlreadySolved = status.isSolved;
          // });
        },
        error: (err) => {
          this.errorMessage = `Erro ao carregar o desafio: ${err.message}`;
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'ID do desafio não fornecido.';
      this.isLoading = false;
    }
  }

  iniciarDesafioReal(): void {
    if (this.desafio) {
      this.isStarting = true;
      this.errorMessage = null;

      this.apiService.startChallenge(this.desafio.id).subscribe({
        next: (session) => {
          this.activeChallengeSession = session;
          this.isStarting = false;
        },
        error: (err) => {
          this.errorMessage = "Falha ao iniciar o ambiente do desafio. Tente novamente.";
          this.isStarting = false;
        }
      });
    }
  }

  // ** PONTO CRÍTICO 2: LÓGICA DE SUBMISSÃO CORRIGIDA E COMPLETA **
  onSubmitFlag(): void {
    // Previne múltiplos cliques ou submissão se já resolvido
    if (this.isSubmitting || this.isAlreadySolved) {
      return;
    }

    if (!this.activeChallengeSession) {
      this.submissionMessage = "Nenhuma sessão de desafio ativa.";
      this.submissionMessageType = 'error';
      return;
    }
    if (!this.flag) {
      this.submissionMessage = "Por favor, insira uma flag para validar.";
      this.submissionMessageType = 'error';
      return;
    }

    // Inicia o processo de submissão
    this.isSubmitting = true;
    this.submissionMessage = '';
    this.submissionMessageType = '';
    this.errorMessage = null; // Limpa erros gerais

    this.apiService.submitFlag(this.activeChallengeSession.containerId, this.flag).subscribe({
      next: (response) => {
        // Sucesso: flag correta
        this.isAlreadySolved = true; // Marca como resolvido para travar a UI
        this.submissionMessage = response.message || "Flag correta! Desafio finalizado.";
        this.submissionMessageType = 'success';
      },
      error: (err) => {
        // Erro: flag incorreta ou outro problema
        this.submissionMessage = err.error?.message || "Flag incorreta ou erro no servidor.";
        this.submissionMessageType = 'error';
      },
      complete: () => {
        // Ao final, para de carregar
        this.isSubmitting = false;
      }
    });
  }
}
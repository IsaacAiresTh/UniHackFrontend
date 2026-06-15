import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ApiService, Desafio } from '../../core/api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-desafio-detalhe',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './desafio-detalhe.component.html',
  styleUrls: ['./desafio-detalhe.component.scss'],
})
export class DesafioDetalheComponent implements OnInit {

  desafio: Desafio | undefined;
  challengeUrl: string = '';
  flag: string = '';
  isLoading: boolean = true;
  isAlreadySolved: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string | null = null;
  submissionMessage: string = '';
  submissionMessageType: 'success' | 'error' | '' = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const desafioId = this.route.snapshot.paramMap.get('id');
    if (!desafioId) {
      this.errorMessage = 'ID do desafio não fornecido.';
      this.isLoading = false;
      return;
    }

    this.apiService.getChallengeDetails(desafioId).subscribe({
      next: (data) => {
        this.desafio = data;
        this.challengeUrl = `${environment.labBaseUrl}/${data.slug}`;
        this.isLoading = false;
        this.loadChallengeStatus(desafioId);
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar o desafio. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  private loadChallengeStatus(id: string): void {
    this.apiService.getChallengeStatus(id).subscribe({
      next: (status) => {
        this.isAlreadySolved = status.solved;
        if (this.isAlreadySolved) {
          this.submissionMessage = 'Você já resolveu este desafio!';
          this.submissionMessageType = 'success';
        }
      },
      error: () => {}
    });
  }

  onSubmitFlag(): void {
    if (this.isSubmitting || this.isAlreadySolved) return;

    if (!this.flag.trim()) {
      this.submissionMessage = 'Por favor, insira uma flag para validar.';
      this.submissionMessageType = 'error';
      return;
    }

    this.isSubmitting = true;
    this.submissionMessage = '';
    this.submissionMessageType = '';

    this.apiService.submitFlag(this.flag).subscribe({
      next: (response) => {
        this.isAlreadySolved = true;
        this.submissionMessage = response.message;
        this.submissionMessageType = 'success';
        this.isSubmitting = false;
      },
      error: (err) => {
        this.submissionMessage = err.error?.message || 'Flag incorreta ou erro no servidor.';
        this.submissionMessageType = 'error';
        this.isSubmitting = false;
      }
    });
  }
}

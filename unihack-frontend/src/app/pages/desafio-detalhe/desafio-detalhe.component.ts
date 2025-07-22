// desafio-detalhe.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // << IMPORTANTE: Para usar o ngModel
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
// Importa os modelos e serviços corretos da API
import { ApiService, Desafio, ActiveChallengeSession } from '../../core/api.service';

@Component({
  selector: 'app-desafio-detalhe',
  standalone: true,
  // Adiciona o FormsModule aqui
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './desafio-detalhe.component.html',
  styleUrls: ['./desafio-detalhe.component.scss'],
  // O ApiService já é 'providedIn: root', então não precisa estar aqui
})
export class DesafioDetalheComponent implements OnInit {
  // USA O MODELO 'Desafio' REAL, não o antigo 'DetalhesDesafio'
  desafio: Desafio | undefined;

  // DECLARA AS PROPRIEDADES QUE ESTAVAM FALTANDO
  activeChallengeSession: ActiveChallengeSession | null = null;
  isStarting: boolean = false;
  flag: string = '';

  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService // Usa o serviço de API real
  ) {}

  ngOnInit(): void {
    const desafioId = this.route.snapshot.paramMap.get('id');
    if (desafioId) {
      // Chama o método correto do serviço de API
      this.apiService.getChallengeDetails(desafioId).subscribe({
        next: (data) => {
          this.desafio = data;
          this.isLoading = false;
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

  onSubmitFlag(): void {
    if (!this.activeChallengeSession) {
        this.errorMessage = "Nenhuma sessão de desafio ativa.";
        return;
    }
    if (!this.flag) {
      this.errorMessage = "Por favor, insira uma flag para validar.";
      return;
    }
    this.errorMessage = null;

    // Chama o método do serviço de API, passando o ID do contentor e a flag
    this.apiService.submitFlag(this.activeChallengeSession.containerId, this.flag).subscribe({
        next: (response) => {
            alert(response.message || "Flag correta! Desafio finalizado.");
            // Opcional: Redirecionar o utilizador de volta para a lista de desafios após o sucesso
            // import { Router } from '@angular/router';
            // constructor(private router: Router) {}
            // this.router.navigate(['/desafios']);
            this.activeChallengeSession = null;
            this.flag = '';
        },
        error: (err) => {
            // O backend envia uma mensagem de erro, vamos mostrá-la
            this.errorMessage = err.error?.message || "Flag incorreta ou erro no servidor.";
        }
    });
  }
}
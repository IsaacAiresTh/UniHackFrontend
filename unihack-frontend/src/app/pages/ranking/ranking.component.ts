import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
// Importa o serviço de API e o modelo de usuário do ranking
import { ApiService, RankingUser } from '../../core/api.service';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  // A lista de usuários do ranking agora usará o tipo da API e começará vazia
  rankingData: RankingUser[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  // Injete o ApiService
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // Chama o método para buscar os dados reais quando o componente for iniciado
    this.loadRankingData();
  }

  // Método que busca os dados do backend
  loadRankingData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.apiService.getRanking().subscribe({
      next: (data) => {
        this.rankingData = data; // Armazena os dados recebidos
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Erro ao buscar o ranking:", err);
        this.errorMessage = "Não foi possível carregar o ranking. Tente novamente mais tarde.";
        this.isLoading = false;
      }
    });
  }
}
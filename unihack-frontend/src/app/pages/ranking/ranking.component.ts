import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe CommonModule
import { NavbarComponent } from '../../shared/navbar/navbar.component'; // Importe se necessário
import { FooterComponent } from '../../shared/footer/footer.component'; // Importe se necessário

// Interface para tipar os dados do usuário no ranking
interface RankingUser {
  posicao: number;
  nome: string;
  pontuacao: number;
  desafiosCompletos: number;
  avatarUrl?: string; // Opcional: URL para o avatar do usuário
}

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent], // Adicione CommonModule e outros componentes compartilhados
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  // Dados de exemplo para o ranking
  // No futuro, você buscará esses dados de um backend
  rankingData: RankingUser[] = [
    { posicao: 1, nome: 'CyberNinja', pontuacao: 1500, desafiosCompletos: 10, avatarUrl: 'assets/avatars/ninja.png' },
    { posicao: 2, nome: 'BinaryBard', pontuacao: 1450, desafiosCompletos: 9, avatarUrl: 'assets/avatars/bard.png' },
    { posicao: 3, nome: 'KernelKing', pontuacao: 1300, desafiosCompletos: 8, avatarUrl: 'assets/avatars/king.png' },
    { posicao: 4, nome: 'RootRider', pontuacao: 1250, desafiosCompletos: 8 },
    { posicao: 5, nome: 'ScriptSorcerer', pontuacao: 1100, desafiosCompletos: 7 },
    { posicao: 6, nome: 'DataDragon', pontuacao: 1050, desafiosCompletos: 7, avatarUrl: 'assets/avatars/dragon.png' },
    { posicao: 7, nome: 'FirewallPhoenix', pontuacao: 980, desafiosCompletos: 6 },
    { posicao: 8, nome: 'LogicLancer', pontuacao: 920, desafiosCompletos: 6 },
    { posicao: 9, nome: 'PacketPaladin', pontuacao: 850, desafiosCompletos: 5 },
    { posicao: 10, nome: 'ZeroDayZephyr', pontuacao: 800, desafiosCompletos: 5 }
  ];

  constructor() { }

  ngOnInit(): void {
    // Aqui você pode adicionar lógica para buscar dados do ranking de um serviço
    // Por exemplo: this.loadRankingData();
  }

  // Método de exemplo para carregar dados de um backend (simulado)
  // loadRankingData(): void {
  //   // Chamar um serviço que faz uma requisição HTTP para /api/ranking
  //   // this.rankingService.getRanking().subscribe(data => {
  //   //   this.rankingData = data;
  //   // });
  // }
}
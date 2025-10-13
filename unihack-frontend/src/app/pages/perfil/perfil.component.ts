// unihack-frontend/src/app/pages/perfil/perfil.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ApiService, RankingUser } from '../../core/api.service';
import { AuthService } from '../../auth/auth.service';

// Interfaces para dados expandidos do perfil
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ChallengeHistory {
  id: string;
  title: string;
  category: string;
  points: number;
  completedAt: Date;
  timeSpent: number; // em minutos
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

interface UserStats {
  totalChallenges: number;
  completedChallenges: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  averageTime: number;
  favoriteCategory: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  // Utilizaremos o mesmo tipo de usuário do ranking por enquanto
  userProfile: RankingUser | null = null;
  isLoading: boolean = true;
  errorMessage: string | null = null;
  
  // Novos dados para o perfil expandido
  achievements: Achievement[] = [];
  challengeHistory: ChallengeHistory[] = [];
  stats: UserStats = {
    totalChallenges: 0,
    completedChallenges: 0,
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageTime: 0,
    favoriteCategory: 'N/A'
  };
  
  // Interface para dados expandidos
  activeTab: string = 'overview';

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Simulação de busca de perfil. O ideal é ter um endpoint específico.
    // Como não temos um, vamos buscar o ranking e encontrar o usuário logado.
    // Esta é uma solução temporária.
    this.apiService.getRanking().subscribe({
      next: (ranking) => {
        const currentUserMatricula = this.authService.getMatriculaFromToken(); // Você precisará criar este método no AuthService
        if (currentUserMatricula) {
          this.userProfile = ranking.find(user => user.matricula === currentUserMatricula) || null;
          if (this.userProfile) {
            this.loadMockData(); // Carregar dados mockados para demonstração
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Erro ao buscar dados do perfil:", err);
        this.errorMessage = "Não foi possível carregar os dados do perfil. Tente novamente mais tarde.";
        this.isLoading = false;
      }
    });
  }

  loadMockData(): void {
    // Dados mockados para demonstração
    this.achievements = [
      {
        id: '1',
        name: 'Primeiro Hack',
        description: 'Resolveu seu primeiro desafio',
        icon: '🎯',
        unlockedAt: new Date('2024-01-15'),
        rarity: 'common'
      },
      {
        id: '2',
        name: 'Mestre da Criptografia',
        description: 'Resolveu 10 desafios de criptografia',
        icon: '🔐',
        unlockedAt: new Date('2024-02-20'),
        rarity: 'rare'
      },
      {
        id: '3',
        name: 'Streak Master',
        description: 'Manteve uma sequência de 7 dias',
        icon: '🔥',
        unlockedAt: new Date('2024-03-10'),
        rarity: 'epic'
      }
    ];

    this.challengeHistory = [
      {
        id: '1',
        title: 'Caesar Cipher',
        category: 'Criptografia',
        points: 50,
        completedAt: new Date('2024-03-15'),
        timeSpent: 25,
        difficulty: 'easy'
      },
      {
        id: '2',
        title: 'SQL Injection',
        category: 'Web Security',
        points: 100,
        completedAt: new Date('2024-03-14'),
        timeSpent: 45,
        difficulty: 'medium'
      },
      {
        id: '3',
        title: 'Buffer Overflow',
        category: 'Binary Exploitation',
        points: 200,
        completedAt: new Date('2024-03-13'),
        timeSpent: 90,
        difficulty: 'hard'
      }
    ];

    this.stats = {
      totalChallenges: 15,
      completedChallenges: 8,
      totalPoints: this.userProfile?.points || 0,
      currentStreak: 3,
      longestStreak: 7,
      averageTime: 35,
      favoriteCategory: 'Criptografia'
    };
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getCompletionPercentage(): number {
    if (this.stats.totalChallenges === 0) return 0;
    return Math.round((this.stats.completedChallenges / this.stats.totalChallenges) * 100);
  }

  getRarityColor(rarity: string): string {
    switch (rarity) {
      case 'common': return '#9CA3AF';
      case 'rare': return '#3B82F6';
      case 'epic': return '#8B5CF6';
      case 'legendary': return '#F59E0B';
      default: return '#9CA3AF';
    }
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
      case 'expert': return '#8B5CF6';
      default: return '#6B7280';
    }
  }

  getUserLevel(): number {
    if (!this.userProfile) return 1;
    return Math.floor(this.userProfile.points / 100) + 1;
  }

  getXPProgress(): number {
    if (!this.userProfile) return 0;
    return this.userProfile.points % 100;
  }
}
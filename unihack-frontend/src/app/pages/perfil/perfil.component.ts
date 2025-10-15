// unihack-frontend/src/app/pages/perfil/perfil.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { RouterModule } from '@angular/router';

// Importe as novas interfaces e o serviço de API
import { ApiService, UserProfile } from '../../core/api.service';

// Interfaces para funcionalidades em desenvolvimento
interface Achievement {
  id: string; name: string; description: string; icon: string; unlockedAt: Date; rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
interface ChallengeHistory {
  id: string; title: string; category: string; points: number; completedAt: Date; timeSpent: number; difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  
  userProfile: UserProfile | null = null;
  
  // Arrays vazios para funcionalidades em desenvolvimento
  achievements: Achievement[] = [];
  challengeHistory: ChallengeHistory[] = [];

  activeTab: string = 'stats';
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private apiService: ApiService) {} // Injeta o serviço de API

  ngOnInit(): void {
    this.loadUserProfile(); // Chama o novo método ao iniciar o componente
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.apiService.getUserProfile().subscribe({
      next: (profileData) => {
        // Dados recebidos com sucesso!
        this.userProfile = profileData;
        
        // Arrays permanecem vazios até implementação das funcionalidades 
        
        this.isLoading = false;
      },
      error: (err) => {
        // Tratamento de erro
        console.error('Erro ao carregar perfil:', err);
        this.errorMessage = 'Não foi possível carregar os dados do perfil. Tente novamente mais tarde.';
        this.isLoading = false;
      }
    });
  }


  // --- MÉTODOS AUXILIARES (usando os dados de `userProfile`) ---

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  
  getUserLevel(): number {
    if (!this.userProfile) return 1;
    return Math.floor(Math.sqrt(this.userProfile.points / 100)) + 1;
  }
  
  getXPProgress(): number {
    if (!this.userProfile) return 0;
    const currentLevel = this.getUserLevel();
    const xpForCurrentLevel = 100 * Math.pow(currentLevel - 1, 2);
    const xpForNextLevel = 100 * Math.pow(currentLevel, 2);
    const progress = (this.userProfile.points - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel) * 100;
    return progress;
  }

  // O resto dos seus métodos...
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
      case 'easy': return '#00E676';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
      case 'expert': return '#8B5CF6';
      default: return '#9CA3AF';
    }
  }
}
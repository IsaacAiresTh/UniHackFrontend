// unihack-frontend/src/app/pages/perfil/perfil.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ApiService, RankingUser } from '../../core/api.service';
import { AuthService } from '../../auth/auth.service';

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
}
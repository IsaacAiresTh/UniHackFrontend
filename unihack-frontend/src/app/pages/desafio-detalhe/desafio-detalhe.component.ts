// desafio-detalhe.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router'; // RouterModule para routerLink
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
// Crie um serviço para gerenciar os dados dos desafios
import { DesafioService, DetalhesDesafio } from './desafio.service'; // Exemplo de serviço

@Component({
  selector: 'app-desafio-detalhe',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './desafio-detalhe.component.html',
  styleUrls: ['./desafio-detalhe.component.scss'],
  providers: [DesafioService] // Adicione o serviço se ele for específico deste componente ou forneça no root
})
export class DesafioDetalheComponent implements OnInit {
  desafio: DetalhesDesafio | undefined;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private desafioService: DesafioService
  ) {}

  ngOnInit(): void {
    const desafioId = this.route.snapshot.paramMap.get('id');
    if (desafioId) {
      this.desafioService.getDetalhesDesafio(desafioId).subscribe({
        next: (data) => {
          this.desafio = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = `Erro ao carregar o desafio: ${err.message}`;
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      this.errorMessage = 'ID do desafio não fornecido.';
      this.isLoading = false;
    }
  }

  iniciarDesafioReal(): void {
    // Lógica para quando o usuário clicar em "Começar o desafio de verdade"
    // Isso pode envolver redirecionar para outra rota, abrir um modal,
    // ou carregar uma parte específica da interface do desafio real.
    if (this.desafio) {
      console.log(`Iniciando desafio real: ${this.desafio.titulo}`);
      // Exemplo: router.navigate(['/ambiente-desafio', this.desafio.id]);
    }
  }
}
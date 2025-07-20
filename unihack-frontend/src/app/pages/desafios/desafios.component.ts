// src/app/pages/desafios/desafios.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngFor, etc.
import { RouterModule } from '@angular/router'; // Para routerLink
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { ApiService, Desafio } from '../../core/api.service'; // IMPORTAMOS O SERVIÇO E O MODELO CORRETO

@Component({
  selector: 'app-desafios',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './desafios.component.html',
  styleUrls: ['./desafios.component.scss']
})
export class DesafiosComponent implements OnInit {

  // Usa o modelo de dados 'Desafio' vindo da API
  listaDeDesafios: Desafio[] = [];
  private todosOsDesafios: Desafio[] = []; // Array para guardar a lista original antes de filtrar

  // A lógica de categorias e filtros permanece
  categorias: string[] = ['Todas']; // Começa com 'Todas', o resto será preenchido pela API se necessário
  filtroCategoriaSelecionada: string = 'Todas';
  filtroBusca: string = '';
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.carregarDesafios();
  }

  carregarDesafios(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Chamada real ao serviço da API para buscar os desafios
    this.apiService.getAllChallenges().subscribe({
      next: (data) => {
        this.todosOsDesafios = data;
        // Mapeia os dados do backend para a estrutura esperada pelo seu template
        // NOTA: O ideal é ajustar o HTML para usar os nomes do backend (title, score, etc.)
        this.aplicarFiltros();
        this.isLoading = false;

        // Extrai categorias unicas, se o modelo do backend tiver um campo 'categoria'
        // Ex: this.categorias = ['Todas', ...new Set(this.todosOsDesafios.map(d => d.categoria))];
      },
      error: (err) => {
        console.error("Falha ao buscar desafios do backend:", err);
        this.errorMessage = "Não foi possível carregar os desafios. Verifique a conexão com o servidor e tente novamente.";
        this.isLoading = false;
      }
    });
  }

  aplicarFiltros(): void {
    let desafiosFiltrados = this.todosOsDesafios;

    // Filtro por categoria (só funcionará se o seu modelo 'Desafio' tiver um campo 'categoria')
    // if (this.filtroCategoriaSelecionada !== 'Todas') {
    //   desafiosFiltrados = desafiosFiltrados.filter(d => d.categoria === this.filtroCategoriaSelecionada);
    // }

    // Filtro por busca (agora usando os campos 'title' e 'description' do backend)
    if (this.filtroBusca.trim() !== '') {
      const termoBuscaLower = this.filtroBusca.toLowerCase();
      desafiosFiltrados = desafiosFiltrados.filter(d =>
        d.title.toLowerCase().includes(termoBuscaLower) ||
        d.description.toLowerCase().includes(termoBuscaLower)
        // || (d.tags && d.tags.some(tag => tag.toLowerCase().includes(termoBuscaLower))) // Se tiver tags
      );
    }
    this.listaDeDesafios = desafiosFiltrados;
  }

  selecionarCategoria(categoria: string): void {
    this.filtroCategoriaSelecionada = categoria;
    this.aplicarFiltros();
  }

  limparBusca(): void {
    this.filtroBusca = '';
    this.aplicarFiltros();
  }
}
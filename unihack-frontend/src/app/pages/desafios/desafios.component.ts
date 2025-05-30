// src/app/pages/desafios/desafios.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngFor, etc.
import { RouterModule } from '@angular/router'; // Para routerLink
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { FormsModule } from '@angular/forms';
// No futuro, você pode ter um serviço para buscar esses desafios
// import { DesafiosService } from './desafios.service';

// Interface para os itens da lista de desafios
export interface DesafioInfo {
  id: string; // Identificador único para a rota (ex: 'sql-injection-basico')
  titulo: string;
  descricaoCurta: string;
  categoria: string;
  pontuacao: number;
  nivelDificuldade: 'Fácil' | 'Médio' | 'Difícil' | 'Insano';
  tags?: string[];
  isCompleto?: boolean; // Opcional: para marcar desafios já feitos pelo usuário
}

@Component({
  selector: 'app-desafios',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './desafios.component.html',
  styleUrls: ['./desafios.component.scss']
  // providers: [DesafiosService] // Se você criar um serviço
})
export class DesafiosComponent implements OnInit {

  listaDeDesafios: DesafioInfo[] = [];
  categorias: string[] = [];
  filtroCategoriaSelecionada: string = 'Todas';
  filtroBusca: string = '';

  // Dados mockados para os desafios. Substitua por dados de um serviço/backend.
  private todosOsDesafios: DesafioInfo[] = [
    {
      id: 'sql-injection-1',
      titulo: 'SQL Injection Básico',
      descricaoCurta: 'Aprenda os fundamentos da injeção de SQL e explore um login vulnerável.',
      categoria: 'Web',
      pontuacao: 100,
      nivelDificuldade: 'Fácil',
      tags: ['SQL', 'Injeção', 'Autenticação'],
      isCompleto: false,
    },
    {
      id: 'xss-basico-1',
      titulo: 'XSS Refletido Simples',
      descricaoCurta: 'Entenda como o XSS refletido funciona injetando scripts em um campo de busca.',
      categoria: 'Web',
      pontuacao: 150,
      nivelDificuldade: 'Fácil',
      tags: ['XSS', 'JavaScript', 'Frontend'],
      isCompleto: true, // Exemplo de desafio completo
    },
    {
      id: 'cripto-cesar-1',
      titulo: 'Cifra de César',
      descricaoCurta: 'Decifre uma mensagem criptografada com a clássica Cifra de César.',
      categoria: 'Criptografia',
      pontuacao: 50,
      nivelDificuldade: 'Fácil',
      tags: ['Cripto Clássica', 'Substituição'],
    },
    {
      id: 'engenharia-social-1',
      titulo: 'Phishing Elementar',
      descricaoCurta: 'Analise um e-mail e identifique sinais de uma tentativa de phishing.',
      categoria: 'Engenharia Social',
      pontuacao: 200,
      nivelDificuldade: 'Médio',
      tags: ['Phishing', 'Análise'],
    },
    {
      id: 'forense-imagem-1',
      titulo: 'Esteganografia em Imagem',
      descricaoCurta: 'Encontre a mensagem escondida dentro de uma imagem aparentemente normal.',
      categoria: 'Forense',
      pontuacao: 250,
      nivelDificuldade: 'Médio',
      tags: ['Esteganografia', 'Imagem', 'Metadados'],
    }
  ];

  constructor(/* private desafiosService: DesafiosService */) { }

  ngOnInit(): void {
    // this.desafiosService.getDesafios().subscribe(dados => this.listaDeDesafios = dados);
    this.listaDeDesafios = [...this.todosOsDesafios]; // Cópia para permitir filtragem
    this.categorias = ['Todas', ...new Set(this.todosOsDesafios.map(d => d.categoria))]; // Extrai categorias únicas
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let desafiosFiltrados = this.todosOsDesafios;

    // Filtro por categoria
    if (this.filtroCategoriaSelecionada !== 'Todas') {
      desafiosFiltrados = desafiosFiltrados.filter(d => d.categoria === this.filtroCategoriaSelecionada);
    }

    // Filtro por busca (título ou descrição)
    if (this.filtroBusca.trim() !== '') {
      const termoBuscaLower = this.filtroBusca.toLowerCase();
      desafiosFiltrados = desafiosFiltrados.filter(d =>
        d.titulo.toLowerCase().includes(termoBuscaLower) ||
        d.descricaoCurta.toLowerCase().includes(termoBuscaLower) ||
        (d.tags && d.tags.some(tag => tag.toLowerCase().includes(termoBuscaLower)))
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
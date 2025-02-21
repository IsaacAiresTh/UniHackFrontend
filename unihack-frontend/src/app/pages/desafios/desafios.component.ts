import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-desafios',
  templateUrl: './desafios.component.html',
  styleUrls: ['./desafios.component.scss'],
  imports: [NavbarComponent, FooterComponent, CommonModule]
})
export class DesafiosComponent implements OnInit {
  desafios: any[] = [];
  paginaAtual: number = 1;
  itensPorPagina: number = 6;
  paginas: number[] = [];

  todosDesafios = [
    { id: 1, nome: 'Desafio SQL Injection', descricao: 'Nível Iniciante. Aplique seus conhecimentos de scripts sql para utilizar um comando e burlar a tela de login do NeoBank' },
    { id: 2, nome: 'Desafio CTF 2', descricao: 'Descrição para o Desafio CTF 2. Isto é um espaço reservado.' },
    { id: 3, nome: 'Desafio CTF 3', descricao: 'Descrição para o Desafio CTF 3. Isto é um espaço reservado.' },
    { id: 4, nome: 'Desafio CTF 4', descricao: 'Descrição para o Desafio CTF 4. Isto é um espaço reservado.' },
    { id: 5, nome: 'Desafio CTF 5', descricao: 'Descrição para o Desafio CTF 5. Isto é um espaço reservado.' },
    { id: 6, nome: 'Desafio CTF 6', descricao: 'Descrição para o Desafio CTF 6. Isto é um espaço reservado.' },
    { id: 7, nome: 'Desafio CTF 7', descricao: 'Descrição para o Desafio CTF 6. Isto é um espaço reservado.' },
    { id: 8, nome: 'Desafio CTF 8', descricao: 'Descrição para o Desafio CTF 6. Isto é um espaço reservado.' },
    { id: 9, nome: 'Desafio CTF 9', descricao: 'Descrição para o Desafio CTF 6. Isto é um espaço reservado.' },
    { id: 10, nome: 'Desafio CTF 10', descricao: 'Descrição para o Desafio CTF 6. Isto é um espaço reservado.' },
    { id: 11, nome: 'Desafio CTF 11', descricao: 'Descrição para o Desafio CTF 6. Isto é um espaço reservado.' },
    { id: 12, nome: 'Desafio CTF 12', descricao: 'Descrição para o Desafio CTF 6. Isto é um espaço reservado.' },
    { id: 13, nome: 'Desafio CTF 13', descricao: 'Descrição para o Desafio CTF 6. Isto é um espaço reservado.' },

  ];

  ngOnInit(): void {
    const totalPaginas = Math.ceil(this.todosDesafios.length / this.itensPorPagina);
    this.paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);
    this.mudarPagina(1);
  }

  mudarPagina(pagina: number) {
    this.paginaAtual = pagina;
    const inicio = (pagina - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.desafios = this.todosDesafios.slice(inicio, fim);
  }

  comecarDesafio(id: number) {
    // Lógica para redirecionar ou iniciar o desafio
    console.log('Desafio iniciado:', id);
  }
}

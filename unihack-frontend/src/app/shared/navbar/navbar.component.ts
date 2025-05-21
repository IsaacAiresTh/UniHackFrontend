import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isVisible = true;
  lastScrollPosition = 0;
  scrollThreshold = 50; // Quantidade mínima de scroll para ocultar/mostrar a navbar

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScrollPosition = window.scrollY;
    
    // Determina se deve mostrar ou esconder a navbar baseado na direção do scroll
    if (currentScrollPosition > this.lastScrollPosition && currentScrollPosition > this.scrollThreshold) {
      // Scrollando para baixo - esconde a navbar
      this.isVisible = false;
    } else {
      // Scrollando para cima ou no topo - mostra a navbar
      this.isVisible = true;
    }
    
    this.lastScrollPosition = currentScrollPosition;
  }
}
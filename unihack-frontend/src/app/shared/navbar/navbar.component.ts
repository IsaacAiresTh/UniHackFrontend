// unihack-frontend/src/app/shared/navbar/navbar.component.ts

import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service'; // 1. IMPORTAR o AuthService

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
  scrollThreshold = 50;

  // 2. INJETAR o AuthService
  constructor(private authService: AuthService) {}

  // 3. CRIAR um "getter" para verificar o status do login
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // 4. CRIAR a função de logout para ser chamada pelo botão
  logout(): void {
    this.authService.logout();
    // O redirecionamento já é feito dentro do authService
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScrollPosition = window.scrollY;
    if (currentScrollPosition > this.lastScrollPosition && currentScrollPosition > this.scrollThreshold) {
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }
    this.lastScrollPosition = currentScrollPosition;
  }
}
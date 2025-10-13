import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { AuthService } from '../../core/auth.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private columns: number[] = [];
  private uniceplac: string = 'UNICEPLAC';
  private showUniceplac: boolean = false;
  private uniceplacTimer: number | null = null;
  private uniceplacPosition: { x: number, y: number } = { x: 0, y: 0 };
  private matrixChars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_-+=<>?/[]{}|'; // Reduzido para melhor performance
  private animationFrameId: number | null = null;
  private resizeListener: (() => void) | null = null;
  private fontSize: number = 14; // Aumentado para reduzir número de colunas
  private fontLoaded: boolean = true; // Removido carregamento de fonte externa
  private animationThrottle: number = 0;
  private lastFrameTime: number = 0;

  // 3. INJETAR AuthService e Router
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
      this.initMatrixEffect();
    }, 100);
    
    // Fallback: remover loading overlay após 3 segundos mesmo se houver problemas
    setTimeout(() => {
      this.removeLoadingOverlay();
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.uniceplacTimer !== null) {
      window.clearInterval(this.uniceplacTimer);
    }
    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resizeListener !== null) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  // Método removido - não precisamos mais carregar fonte externa

  private initMatrixEffect(): void {
    console.log('Iniciando efeito Matrix...');
    
    this.canvas = document.getElementById('matrixBackground') as HTMLCanvasElement;
    if (!this.canvas) {
      console.error('Canvas element not found');
      this.removeLoadingOverlay();
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      console.error('Failed to get canvas context');
      this.removeLoadingOverlay();
      return;
    }
    
    // Configuração básica do canvas
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    console.log('Canvas inicializado:', this.canvas.width, 'x', this.canvas.height);
    
    // Calcular número de colunas (versão mais simples)
    const columns = Math.floor(this.canvas.width / this.fontSize);
    console.log('Número de colunas:', columns);
    
    // Inicializar colunas
    this.columns = Array(columns).fill(0);
    
    // Configurar timer para UNICEPLAC
    this.uniceplacTimer = window.setInterval(() => {
      this.toggleUniceplac();
    }, Math.random() * 5000 + 6000);
    
    // Iniciar animação
    console.log('Iniciando animação...');
    this.animate();
    
    // Remover loading overlay
    setTimeout(() => {
      this.removeLoadingOverlay();
    }, 1000);
    
    // Listener de resize
    this.resizeListener = this.handleResize.bind(this);
    window.addEventListener('resize', this.resizeListener);
  }

  private handleResize(): void {
    if (!this.canvas || !this.ctx) return;
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    const columns = Math.floor(this.canvas.width / this.fontSize) * 0.6; // Reduzido para 60% das colunas
    const canvasHeight = this.canvas.height;
    this.columns = Array(columns).fill(0).map(() => 
      Math.floor(Math.random() * canvasHeight / this.fontSize)
    );
  }

  private toggleUniceplac(): void {
    if (!this.canvas) return;
    
    // Exibir "UNICEPLAC" por 3 segundos
    this.showUniceplac = true;
    
    // Escolher uma posição aleatória, mas não muito perto das bordas
    const margin = 200;
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    
    this.uniceplacPosition = {
      x: Math.random() * (canvasWidth - margin * 2) + margin,
      y: Math.random() * (canvasHeight - margin * 2) + margin
    };
    
    setTimeout(() => {
      this.showUniceplac = false;
    }, 3000);
  }

  private animate(): void {
    if (!this.ctx || !this.canvas) {
      console.error('Cannot animate: missing context or canvas');
      this.removeLoadingOverlay();
      return;
    }
    
    // Limpar canvas com efeito de desbotamento
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Configurar fonte
    this.ctx.font = `${this.fontSize}px monospace`;
    
    // Desenhar UNICEPLAC se necessário
    if (this.showUniceplac) {
      this.ctx.font = `bold 48px monospace`;
      this.ctx.fillStyle = '#00E676';
      this.ctx.fillText(this.uniceplac, this.uniceplacPosition.x, this.uniceplacPosition.y);
    }
    
    // Desenhar caracteres Matrix
    const canvasHeight = this.canvas.height;
    
    for (let i = 0; i < this.columns.length; i++) {
      // Caractere aleatório
      const char = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
      
      // Posição
      const x = i * this.fontSize;
      const y = this.columns[i] * this.fontSize;
      
      // Cor verde Matrix
      const intensity = Math.random() * 0.5 + 0.5;
      this.ctx.fillStyle = `rgba(0, ${Math.floor(255 * intensity)}, 0, ${intensity})`;
      
      // Desenhar caractere
      this.ctx.font = `${this.fontSize}px monospace`;
      this.ctx.fillText(char, x, y);
      
      // Resetar coluna se chegou ao final
      if (y > canvasHeight && Math.random() > 0.975) {
        this.columns[i] = 0;
      } else {
        this.columns[i]++;
      }
    }
    
    // Continuar animação
    this.animationFrameId = window.requestAnimationFrame(() => this.animate());
  }

  private removeLoadingOverlay(): void {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.remove();
      }, 300);
    }
  }

  iniciarJornada(): void {
    if (this.authService.isLoggedIn()) {
      // Esta parte já está funcionando
      this.router.navigate(['/desafios']);
    } else {
    // AQUI está a correção necessária, baseada no seu arquivo de rotas
    this.router.navigate(['/auth/cadastro']);
    }
  }
}
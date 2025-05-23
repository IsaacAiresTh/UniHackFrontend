import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

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
  private matrixChars: string = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_-+=<>?/[]{}|';
  private animationFrameId: number | null = null;
  private resizeListener: (() => void) | null = null;
  private fontSize: number = 12;
  private fontLoaded: boolean = false;

  ngOnInit(): void {
    // Carregar a fonte antes de inicializar o efeito Matrix
    this.loadCustomFont().then(() => {
      // Inicializar canvas após a fonte ser carregada
      setTimeout(() => {
        this.initMatrixEffect();
      }, 100);
    });
  }

  ngOnDestroy(): void {
    // Limpar interval quando o componente for destruído
    if (this.uniceplacTimer !== null) {
      window.clearInterval(this.uniceplacTimer);
      this.uniceplacTimer = null;
    }

    // Cancelar a animação
    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Remover o evento de resize
    if (this.resizeListener !== null) {
      window.removeEventListener('resize', this.resizeListener);
      this.resizeListener = null;
    }
  }

  private async loadCustomFont(): Promise<void> {
    try {
      // Criar o elemento style se não existir
      if (!document.querySelector('#uniceplac-font-style')) {
        const style = document.createElement('style');
        style.id = 'uniceplac-font-style';
        style.textContent = `@import url('https://fonts.googleapis.com/css2?family=WDXL+Lubrifont+TC&display=swap');`;
        document.head.appendChild(style);
      }

      // Usar Font Loading API se disponível
      if ('fonts' in document) {
        const font = new FontFace('WDXL Lubrifont TC', "url('https://fonts.gstatic.com/s/wdxllubrifonttc/v1/9Bt43C9KxNEAVTHCZI-2FlRL6o6CWiJGAYM.woff2')");
        await font.load();
        document.fonts.add(font);
        this.fontLoaded = true;
      } else {
        // Fallback para navegadores que não suportam Font Loading API
        await new Promise((resolve) => {
          setTimeout(() => {
            this.fontLoaded = true;
            resolve(void 0);
          }, 2000); // Aguarda 2 segundos para garantir que a fonte foi carregada
        });
      }
    } catch (error) {
      console.warn('Erro ao carregar fonte personalizada, usando fonte padrão:', error);
      this.fontLoaded = true; // Continua mesmo sem a fonte personalizada
    }
  }

  private initMatrixEffect(): void {
    this.canvas = document.getElementById('matrixBackground') as HTMLCanvasElement;
    if (!this.canvas) {
      console.error('Canvas element not found');
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      console.error('Failed to get canvas context');
      return;
    }
    
    // Ajustar canvas para ocupar a tela inteira
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Calcular o número de colunas com base na largura da tela
    const columns = Math.floor(this.canvas.width / this.fontSize);
    
    // Inicializar posição vertical de cada coluna com valores aleatórios para evitar "ondas"
    const canvasHeight = this.canvas.height;
    this.columns = Array(columns).fill(0).map(() => 
      Math.floor(Math.random() * canvasHeight / this.fontSize)
    );
    
    // Configurar o timer para exibir "UNICEPLAC" a cada 8-15 segundos
    this.uniceplacTimer = window.setInterval(() => {
      this.toggleUniceplac();
    }, Math.random() * 5000 + 6000);
    
    // Iniciar a animação
    this.animate();
    
    // Ajustar canvas quando a tela for redimensionada
    this.resizeListener = this.handleResize.bind(this);
    window.addEventListener('resize', this.resizeListener);
  }

  private handleResize(): void {
    if (!this.canvas || !this.ctx) return;
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    const columns = Math.floor(this.canvas.width / this.fontSize);
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
      return;
    }
    
    // Criar um efeito de desbotamento com retângulo semi-transparente
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Configuração para os caracteres Matrix
    this.ctx.font = `${this.fontSize}px monospace`;
    
    if (this.showUniceplac) {
      // Configurar fonte personalizada para UNICEPLAC
      const fontFamily = this.fontLoaded ? 'WDXL Lubrifont TC' : 'monospace';
      this.ctx.font = `bold 48px "${fontFamily}", monospace`;
      
      // Exibir "UNICEPLAC" na posição definida
      this.ctx.fillStyle = '#00E676';
      this.ctx.fillText(this.uniceplac, this.uniceplacPosition.x, this.uniceplacPosition.y);
      
      // Efeito de brilho sutil para destacar a fonte personalizada
      this.ctx.shadowColor = '#00E676';
      this.ctx.shadowBlur = 6;
      this.ctx.fillText(this.uniceplac, this.uniceplacPosition.x, this.uniceplacPosition.y);
      this.ctx.shadowBlur = 0;
    }
    
    // Desenhar os caracteres com tamanho consistente
    const canvasHeight = this.canvas.height;
    
    for (let i = 0; i < this.columns.length; i++) {
      // Escolher um caractere aleatório
      const charIndex = Math.floor(Math.random() * this.matrixChars.length);
      const char = this.matrixChars[charIndex];
      
      // Posição x baseada no índice da coluna e tamanho da fonte
      const x = i * this.fontSize;
      const y = this.columns[i] * this.fontSize;
      
      // Variação de cor para efeito de profundidade
      const intensity = Math.min(Math.floor(Math.random() * 5) + 3, 10) / 10;
      this.ctx.fillStyle = `rgba(0, ${Math.floor(230 * intensity)}, ${Math.floor(118 * intensity)}, ${0.8 + (intensity * 0.2)})`;
      
      // Desenhar o caractere com tamanho constante
      this.ctx.font = `${this.fontSize}px monospace`;
      this.ctx.fillText(char, x, y);
      
      // Se o caractere alcançou o final da tela ou aleatoriamente
      if (y > canvasHeight && Math.random() > 0.975) {
        this.columns[i] = 0;
      } else {
        this.columns[i]++;
      }
    }
    
    // Continuar a animação
    this.animationFrameId = window.requestAnimationFrame(() => this.animate());
  }
}
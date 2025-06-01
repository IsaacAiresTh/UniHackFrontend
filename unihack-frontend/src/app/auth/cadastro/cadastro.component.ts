// src/app/auth/cadastro/cadastro.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service'; // Certifique-se que o caminho está correto
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Necessário para FormGroup, FormBuilder
    RouterModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  cadastroForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // AuthService já está injetado
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      // Adicione outros campos conforme necessário (ex: confirmarSenha)
      // confirmarSenha: ['', Validators.required]
    }
    // , { validators: this.senhasCoincidemValidator } // Exemplo de validador customizado
    );
  }

  // Exemplo de validador customizado se você tiver campo de confirmar senha
  // senhasCoincidemValidator(form: FormGroup) {
  //   const senha = form.get('senha')?.value;
  //   const confirmarSenha = form.get('confirmarSenha')?.value;
  //   return senha === confirmarSenha ? null : { senhasNaoCoincidem: true };
  // }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched(); // Marca todos os campos como tocados para exibir erros de validação
      this.errorMessage = 'Por favor, corrija os erros no formulário.';
      return;
    }

    this.isLoading = true;
    // Remova campos que não devem ser enviados ao backend, se houver (ex: confirmarSenha)
    const { confirmarSenha, ...dadosParaEnviar } = this.cadastroForm.value;

    this.authService.register(dadosParaEnviar).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Cadastro realizado com sucesso! Você será redirecionado para o login.';
        console.log('Usuário cadastrado:', response);
        // Opcional: redirecionar para a página de login ou dashboard após um pequeno delay
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = `Erro ao cadastrar: ${error.error?.message || error.message || 'Ocorreu um erro desconhecido.'}`;
        console.error('Erro no cadastro:', error);
        // Verifique a estrutura do erro do seu backend para uma mensagem mais específica
        // Ex: if (error.status === 409) this.errorMessage = 'Este email já está cadastrado.';
      }
    });
  }
}
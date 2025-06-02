// src/app/auth/cadastro/cadastro.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { CommonModule } from '@angular/common';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const senha = control.get('senha');
  const confirmacaoSenha = control.get('confirmacaoSenha');

  if (senha && confirmacaoSenha && senha.value !== confirmacaoSenha.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  cadastroForm!: FormGroup;
  errorMessage: string | null = null;
  isLoading: boolean = false;
  successMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Os formControlNames aqui ('nome', 'senha', 'confirmacaoSenha') devem corresponder
    // aos usados no template cadastro.component.html
    this.cadastroForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      matricula: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(7), Validators.maxLength(7)]], // Adicionada validação de 7 dígitos
      senha: ['', [Validators.required, Validators.minLength(8)]], // Mínimo de 8 caracteres conforme RegisterDto
      confirmacaoSenha: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.isLoading = true;

    if (this.cadastroForm.valid) {
      // ****** ALTERAÇÃO APLICADA AQUI ******
      // Mapeia os valores do formulário para os nomes de campo esperados pelo backend (RegisterDto)
      const dadosParaEnviar = {
        name: this.cadastroForm.value.nome, // 'nome' do formulário mapeado para 'name'
        matricula: this.cadastroForm.value.matricula,
        password: this.cadastroForm.value.senha, // 'senha' do formulário mapeado para 'password'
        confirmPassword: this.cadastroForm.value.confirmacaoSenha // 'confirmacaoSenha' para 'confirmPassword'
      };

      this.authService.register(dadosParaEnviar).subscribe({ // Envia o objeto mapeado
        next: (response) => {
          console.log('Cadastro bem-sucedido:', response);
          this.successMessage = 'Cadastro realizado com sucesso! Redirecionando para login...';
          this.isLoading = false;
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Erro no cadastro:', err); // Este é o log que você está vendo
          this.errorMessage = err.message || 'Erro ao realizar cadastro. Verifique os dados e tente novamente.';
        }
      });
    } else {
      this.isLoading = false;
      if (this.cadastroForm.errors?.['passwordMismatch']) {
        this.errorMessage = 'As senhas não coincidem.';
      } else {
        this.errorMessage = 'Por favor, preencha todos os campos corretamente e verifique os formatos.';
      }
      this.markFormGroupTouched(this.cadastroForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
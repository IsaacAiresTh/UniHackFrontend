import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NavbarComponent } from "../../shared/navbar/navbar.component"; // Verifique o caminho se necessário
import { FooterComponent } from "../../shared/footer/footer.component"; // Verifique o caminho se necessário
import { CommonModule } from '@angular/common'; // Adicionar CommonModule

@Component({
  selector: 'app-login',
  standalone: true, // Assumindo que é standalone
  imports: [
    CommonModule, // Adicionado para *ngIf, etc.
    ReactiveFormsModule, // ADICIONADO AQUI
    NavbarComponent,
    FooterComponent,
    // RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  loading: boolean = false; // Já existia no seu arquivo anterior, garantindo que está aqui.
  hidePassword: boolean = true; // Já existia no seu arquivo anterior.

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      matricula: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      // No seu HTML é formControlName="senha", então aqui deve ser "senha".
      // Se no HTML for "password", alinhe aqui também.
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Método para alternar a visibilidade da senha, se o botão existir no HTML
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.loading = true; // Iniciar loading

    if (this.loginForm.valid) {
      const { matricula, senha } = this.loginForm.value;
      this.authService.login(matricula, senha).subscribe({
        next: (response) => {
          this.loading = false;
          console.log('Login bem-sucedido:', response);
          this.router.navigate(['/home']); // Ou para a página de desafios, ou onde for apropriado
        },
        error: (err) => {
          this.loading = false;
          console.error('Erro no login:', err);
          this.errorMessage = err.message || 'Matrícula ou senha inválidos.';
        }
      });
    } else {
      this.loading = false;
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
      this.markFormGroupTouched(this.loginForm);
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
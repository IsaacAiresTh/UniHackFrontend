import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { NavbarComponent } from "../../shared/navbar/navbar.component";

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  hidePassword = true;
  hideConfirmPassword = true;
  
  constructor(private formBuilder: FormBuilder) {}
  
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      matricula: ['', [Validators.required, Validators.pattern(/^\d{7}$/)]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
      ]],
      confirmPassword: ['', [Validators.required]],
      termsAccepted: [false, [Validators.requiredTrue]]
    }, {
      validators: this.mustMatch('password', 'confirmPassword')
    });
  }
  
  // Função personalizada para validar se as senhas coincidem
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (!control || !matchingControl) {
        return null;
      }

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return null;
      }

      // Verifica se as senhas coincidem
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
      return null;
    };
  }
  
  // Getter para acesso fácil aos campos do formulário
  get f() { return this.registerForm.controls; }
  
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
  
  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    // Para o envio se o formulário for inválido
    if (this.registerForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    // Aqui você implementaria a lógica de registro
    // Por exemplo, chamando um serviço de autenticação
    
    // Simulando um atraso de resposta do servidor
    setTimeout(() => {
      console.log('Register form submitted', this.registerForm.value);
      this.loading = false;
      // Redirecionar após registro bem-sucedido
      // this.router.navigate(['/auth/login']);
    }, 1500);
  }
}
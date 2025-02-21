import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  hidePassword = true;
  
  constructor(private formBuilder: FormBuilder) {}
  
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      matricula: ['', [Validators.required, Validators.pattern(/^\d{7}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }
  
  // Getter para acesso fácil aos campos do formulário
  get f() { return this.loginForm.controls; }
  
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    // Para o envio se o formulário for inválido
    if (this.loginForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    // Aqui você implementaria a lógica de autenticação
    // Por exemplo, chamando um serviço de autenticação
    
    // Simulando um atraso de resposta do servidor
    setTimeout(() => {
      console.log('Login form submitted', this.loginForm.value);
      this.loading = false;
      // Redirecionar após login bem-sucedido
      // this.router.navigate(['/dashboard']);
    }, 1500);
  }
}
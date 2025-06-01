import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from "../../shared/footer/footer.component"; // Importar FooterComponent
import { NavbarComponent } from "../../shared/navbar/navbar.component"; // Importar NavbarComponent

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NavbarComponent, // Adicionado NavbarComponent
    FooterComponent  // Adicionado FooterComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss' // Corrigido para styleUrls se você tiver múltiplos, ou manter styleUrl
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
  
  get f() { return this.loginForm.controls; }
  
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.loginForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    setTimeout(() => {
      console.log('Login form submitted', this.loginForm.value);
      this.loading = false;
      // this.router.navigate(['/dashboard']);
    }, 1500);
  }
}
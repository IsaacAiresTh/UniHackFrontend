// unihack-frontend/src/app/app.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
// Se você for usar o footer no app.component.html, descomente a linha abaixo
// import { FooterComponent } from "./shared/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  // Apenas os imports dos componentes que o template realmente usa
  imports: [CommonModule, RouterModule, NavbarComponent], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'unihack-platform';
}
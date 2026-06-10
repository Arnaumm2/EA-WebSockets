import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserResponse, OrgResponse } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  // Login Form
  public nombre: string = '';
  public email: string = '';
  public password: string = '123456'; // Default for quick testing
  public nombreOrg: string = 'Mi Organización';

  public isLoading: boolean = false;
  public errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit() {
    if (!this.nombre || !this.email || !this.nombreOrg) {
      this.errorMessage = 'Por favor, rellena nombre, email y organización.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      // 1. Crear Organización (o asume que creamos una nueva cada vez para el registro rápido)
      this.authService.createOrganization(this.nombreOrg).subscribe({
        next: (org: OrgResponse) => {
          // 2. Crear Usuario asociándolo a la Org recién creada
          const userData = {
            name: this.nombre,
            email: this.email,
            password: this.password,
            organizacion: org._id
          };

          this.authService.createUser(userData).subscribe({
            next: (user: UserResponse) => {
              // 3. Fake Login: Guardamos info en sessionStorage y redirigimos
              sessionStorage.setItem('chat_user_id', user._id);
              sessionStorage.setItem('chat_user_name', user.name);
              sessionStorage.setItem('chat_org_id', org._id);
              sessionStorage.setItem('chat_org_name', org.name);
              
              this.isLoading = false;
              this.router.navigate(['/chat']);
            },
            error: (err) => {
              console.error('Error creando usuario:', err);
              this.errorMessage = 'Error al registrar el usuario. Comprueba que el email no exista ya.';
              this.isLoading = false;
            }
          });
        },
        error: (err) => {
          console.error('Error creando org:', err);
          this.errorMessage = 'Error al crear la organización.';
          this.isLoading = false;
        }
      });
    } catch (error) {
      this.errorMessage = 'Hubo un problema con la red.';
      this.isLoading = false;
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  organizacion: string;
}

export interface OrgResponse {
  _id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:1337/api'; // Swagger is served here, but the routes are at root actually. Wait, server.ts says: router.use('/usuarios', ...). Let's use root directly.
  private readonly BASE_URL = 'http://localhost:1337';

  constructor(private http: HttpClient) { }

  // 1. Crear Organización
  createOrganization(name: string): Observable<OrgResponse> {
    return this.http.post<OrgResponse>(`${this.BASE_URL}/organizaciones`, { name });
  }

  // 2. Crear Usuario
  createUser(userData: any): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.BASE_URL}/usuarios`, userData);
  }

  // 3. Obtener Usuario por ID (Mock de "Login" rápido por ID o Email)
  // Para un login de verdad se usaría un endpoint de auth/login, pero como quiero un registro rápido...
  getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.BASE_URL}/usuarios`);
  }
}

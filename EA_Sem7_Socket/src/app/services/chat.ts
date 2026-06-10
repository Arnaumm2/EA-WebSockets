import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Mensaje {
  usuario: any;
  organizacion: string;
  contenido: string;
  _id?: string;
  leido?: boolean;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Chat {
  private socket: Socket;
  private readonly SERVER_URL = 'http://localhost:1337';

  private usuariosActivosSubject = new BehaviorSubject<string[]>([]);

  constructor(private http: HttpClient) {
    this.socket = io(this.SERVER_URL);

    this.socket.on('connect', () => {
      console.log('SOCKET CONECTADO:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('SOCKET DESCONECTADO');
    });

    this.socket.on('connect_error', (err) => {
      console.log('ERROR SOCKET:', err.message);
    });

    this.socket.on('usuarios_activos', (usuarios: string[]) => {
      console.log('USUARIOS RECIBIDOS:', usuarios);
      this.usuariosActivosSubject.next(usuarios);
    });
  }

  getHistory(): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.SERVER_URL}/mensajes`);
  }

  joinOrganization(organizacionId: string): void {
    this.socket.emit('join-organization', organizacionId);
  }

  sendMessage(mensaje: Mensaje): void {
    this.socket.emit('message', mensaje);
  }

  sendTyping(usuario: string, usuarioName: string): void {
    this.socket.emit('typing', { usuario, usuarioName });
  }

  stopTyping(usuario: string, usuarioName: string): void {
    this.socket.emit('stop-typing', { usuario, usuarioName });
  }

  onUserTyping(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('user-typing', (data) => observer.next(data));
    });
  }

  onUserStopTyping(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('user-stop-typing', (data) => observer.next(data));
    });
  }

  enviarUsuario(username: string): void {
    if (!username?.trim()) {
      console.log('username vacío, no se envía');
      return;
    }

    if (this.socket.connected) {
      console.log('EMIT nuevo_usuario:', username);
      this.socket.emit('nuevo_usuario', username);
    } else {
      this.socket.once('connect', () => {
        console.log('EMIT nuevo_usuario tras connect:', username);
        this.socket.emit('nuevo_usuario', username);
      });
    }
  }

  getMessages(): Observable<Mensaje> {
    return new Observable((observer) => {
      this.socket.on('message', (data: Mensaje) => observer.next(data));
    });
  }

  getUsuariosActivos(): Observable<string[]> {
    return this.usuariosActivosSubject.asObservable();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
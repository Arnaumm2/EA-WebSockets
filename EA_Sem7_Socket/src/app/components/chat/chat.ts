import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chat, Mensaje } from '../../services/chat';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class ChatComponent implements OnInit, OnDestroy {
  public usuarioActivo: string = ''; 
  public usuarioActivoName: string = '';
  public organizacionActiva: string = '';
  public organizacionActivaName: string = '';
  
  public nuevoMensaje: string = '';
  public mensajes: Mensaje[] = [];
  public usuarios: string[] = [];
  private usuariosSub!: Subscription;

  public typingUser: string | null = null;

  private messageSub!: Subscription;
  private typingSub!: Subscription;
  private stopTypingSub!: Subscription;
  private typingTimeout: any;

  constructor(
    private chatService: Chat,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {console.log('CONSTRUCTOR CHAT COMPONENT');}

  ngOnInit(): void {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    this.usuarioActivo = sessionStorage.getItem('chat_user_id') || '';
    this.usuarioActivoName = sessionStorage.getItem('chat_user_name') || '';
    this.organizacionActiva = sessionStorage.getItem('chat_org_id') || '';
    this.organizacionActivaName = sessionStorage.getItem('chat_org_name') || '';
  }

  console.log('USER ID:', this.usuarioActivo);
  console.log('USER NAME:', this.usuarioActivoName);
  console.log('ORG ID:', this.organizacionActiva);

  if (!this.usuarioActivo || !this.organizacionActiva) {
    this.router.navigate(['/login']);
    return;
  }

  this.usuariosSub = this.chatService.getUsuariosActivos().subscribe((usuarios: string[]) => {
    console.log('Usuarios activos:', usuarios);
    this.usuarios = usuarios;
  });

  this.chatService.enviarUsuario(this.usuarioActivoName);

  this.chatService.getHistory().subscribe((history: Mensaje[]) => {
    this.mensajes = history;
    this.scrollToBottom();
  });

  this.chatService.joinOrganization(this.organizacionActiva);

  this.messageSub = this.chatService.getMessages().subscribe((mensaje: Mensaje) => {
    this.mensajes.push(mensaje);
    this.scrollToBottom();
  });

  this.typingSub = this.chatService.onUserTyping().subscribe((data: any) => {
    this.typingUser = `${data.usuarioName} está escribiendo...`;
    this.cdr.detectChanges();
  });

  this.stopTypingSub = this.chatService.onUserStopTyping().subscribe(() => {
    this.typingUser = null;
    this.cdr.detectChanges();
  });
}
  ngOnDestroy(): void {
    if (this.messageSub) this.messageSub.unsubscribe();
    if (this.typingSub) this.typingSub.unsubscribe();
    if (this.stopTypingSub) this.stopTypingSub.unsubscribe();
    if (this.usuariosSub) this.usuariosSub.unsubscribe();
    this.chatService.disconnect();
  }

  enviarMensaje(): void {
    if (!this.nuevoMensaje.trim()) return;

    const mensaje: Mensaje = {
      usuario: this.usuarioActivo,
      organizacion: this.organizacionActiva,
      contenido: this.nuevoMensaje
    };

    this.chatService.sendMessage(mensaje);
    this.chatService.stopTyping(this.usuarioActivo, this.usuarioActivoName);
    this.nuevoMensaje = '';
  }

  onTyping(): void {
    this.chatService.sendTyping(this.usuarioActivo, this.usuarioActivoName);
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.chatService.stopTyping(this.usuarioActivo, this.usuarioActivoName);
    }, 1500);
  }

  getUsuarioName(usuario: any): string {
    if (typeof usuario === 'object' && usuario !== null) {
      return usuario.name || usuario._id;
    }
    return usuario;
  }

  esMensajeMio(mensaje: Mensaje): boolean {
    const id = typeof mensaje.usuario === 'object' ? mensaje.usuario._id : mensaje.usuario;
    return id === this.usuarioActivo;
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.getElementById('chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }
}
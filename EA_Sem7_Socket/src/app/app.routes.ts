import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'chat', component: ChatComponent }
];

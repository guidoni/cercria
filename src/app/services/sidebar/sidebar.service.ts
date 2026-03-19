import { Injectable, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  // Injeta o Router do Angular para poder ouvir as mudanças de rota
  private router = inject(Router);

  // Signal que controla se a sidebar está aberta (false = fechada por padrão)
  aberta = signal(false);

  constructor() {
    // Fica "escutando" toda vez que o usuário navega para uma rota
    this.router.events.subscribe((event) => {
      // Só age quando a navegação terminou
      if (event instanceof NavigationEnd) {
        // Abre a sidebar se estiver na /home, fecha em qualquer outra rota
        this.aberta.set(event.urlAfterRedirects === '/home');
      }
    });
  }

  // Inverte o estado atual: se estava aberta fecha, se estava fechada abre
  toggle() {
    this.aberta.set(!this.aberta());
  }
}

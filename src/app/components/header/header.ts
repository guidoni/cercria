import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { SidebarService } from '../../services/sidebar/sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  usuario = 'Faça seu Login';
  sidebarService = inject(SidebarService);

  constructor(private router: Router) {}

  ngOnInit() {
    const user = localStorage.getItem('usuario');

    if (user) {
      const usuarioObj = JSON.parse(user);
      this.usuario = usuarioObj.nome;
    }
  }

  logout() {
    Swal.fire({
      title: 'Deseja sair?',
      text: 'Sua sessão será encerrada.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, sair',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('usuario');
        this.router.navigate(['/login']);
        Swal.fire({
          title: 'Logout realizado!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }
}

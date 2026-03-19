import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar/sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  usuario = 'Faça seu Login';
  sidebarService = inject(SidebarService);
}

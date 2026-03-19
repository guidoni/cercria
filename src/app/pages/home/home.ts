import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Layout } from '../../components/layout/layout';
import { SideAlert } from '../../components/side-alert/side-alert';
import { Header } from '../../components/header/header';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Layout, SideAlert, Header, Sidebar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}

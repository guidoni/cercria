import { Component } from '@angular/core';
import { AlertaService } from '../../services/alerta/alerta.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-side-alert',
  imports: [],
  templateUrl: './side-alert.html',
  styleUrl: './side-alert.css',
})
export class SideAlert {
  alerts: any[] = [];

  paginaAtual = 1;
  itensPorPagina = 3;

  constructor(
    private alertaService: AlertaService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.alertaService.selecionar().subscribe({
      next: (res) => {
        //console.log('ALERTAS:', res);
        this.alerts = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  get alertasPaginados() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;

    return this.alerts.slice(inicio, fim);
  }

  proximaPagina() {
    const totalPaginas = Math.ceil(this.alerts.length / this.itensPorPagina);

    if (this.paginaAtual < totalPaginas) {
      this.paginaAtual++;
    }
  }

  paginaAnterior() {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
    }
  }

  get totalPaginas() {
    return Math.ceil(this.alerts.length / this.itensPorPagina);
  }
}

import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Acolhido } from '../../../models/Acolhido';
import { NgxMaskPipe } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AcolhidoService } from '../../../services/acolhido/acolhido.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-acolhido-listagem',
  imports: [RouterLink, FormsModule, Header, CommonModule, NgxMaskPipe, Sidebar],
  templateUrl: './acolhido-listagem.html',
  styleUrl: './acolhido-listagem.css',
})
export class AcolhidoListagem {
  acolhidos = signal<Acolhido[]>([]);

  // Injeção do serviço responsável pelas operações com acolhidos
  private servico = inject(AcolhidoService);

  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {
    this.servico.selecionar().subscribe({
      next: (retorno) => {
        this.acolhidos.set(retorno);
      },
      error: (err) => {
        console.error('erro:', err);
      },
    });
  }

  //Configuração do card
  acolhidoSelecionado = signal<Acolhido | null>(null);

  abrirDetalhes(acolhido: Acolhido) {
    this.acolhidoSelecionado.set(acolhido);
  }

  fecharDetalhes() {
    this.acolhidoSelecionado.set(null);
  }

  //Filtro de status
  filtroStatus: string = 'todos';

  filtrarAcolhidos() {
    //Verifica se o acolhido está ativo ou não pela data de saída
    //Se data de saída == NULL, o acolhido está ATIVO. Caso contrário, INATIVO
    if (this.filtroStatus === 'ativos') {
      return this.acolhidos().filter((a) => a.ativo);
    }

    if (this.filtroStatus === 'inativos') {
      return this.acolhidos().filter((a) => !a.ativo);
    }

    return this.acolhidos();
  }

  //Método excluir
  excluir(id: number): void {
    Swal.fire({
      title: 'Excluir acolhido?',
      text: 'Essa ação não poderá ser revertida.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.servico.remover(id).subscribe({
          next: () => {
            this.servico.selecionar().subscribe({
              next: (retorno) => this.acolhidos.set(retorno),
            });

            this.toastr.success('Acolhido excluído com sucesso!');
          },
          error: (err) => {
            console.error(err);
            this.toastr.error('Erro ao remover acolhido.');
          },
        });
      }
    });
  }
}

import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Acolhido } from '../../../models/Acolhido';
import { NgxMaskPipe } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AcolhidoService } from '../../../services/acolhido/acolhido.service';

@Component({
  selector: 'app-acolhido-listagem',
  imports: [RouterLink, FormsModule, Header, CommonModule, NgxMaskPipe, Sidebar],
  templateUrl: './acolhido-listagem.html',
  styleUrl: './acolhido-listagem.css',
})
export class AcolhidoListagem {
  acolhidos = signal<Acolhido[]>([]);

  constructor(
    private servico: AcolhidoService,
    private toastr: ToastrService,
  ) {}

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

  excluir(id: number) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Esse funcionário será excluído!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.servico.remover(id).subscribe({
          next: () => {
            this.acolhidos.update((lista) => lista.filter((m) => m.id !== id));
            this.toastr.success('Acolhido excluído com sucesso!');
          },
          error: (err) => {
            console.error('Erro ao excluir:', err);
          },
        });
      }
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
    if (this.filtroStatus === 'ativos') {
      return this.acolhidos().filter((a) => a.ativo);
    }

    if (this.filtroStatus === 'inativos') {
      return this.acolhidos().filter((a) => !a.ativo);
    }

    return this.acolhidos();
  }
}

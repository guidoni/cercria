import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Funcionario } from '../../../models/Funcionario';
import { FuncionarioService } from '../../../services/funcionario/funcionario.service';
import { NgxMaskPipe } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-funcionario-listagem',
  imports: [RouterLink, FormsModule, Header, CommonModule, NgxMaskPipe, Sidebar],
  templateUrl: './funcionario-listagem.html',
  styleUrl: './funcionario-listagem.css',
})
export class FuncionarioListagem implements OnInit {
  funcionarios = signal<Funcionario[]>([]);

  constructor(
    private servico: FuncionarioService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.servico.selecionar().subscribe({
      next: (retorno) => {
        this.funcionarios.set(retorno);
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
            this.funcionarios.update((lista) => lista.filter((m) => m.id !== id));
            this.toastr.success('Funcionário excluído com sucesso!');
          },
          error: (err) => {
            console.error('Erro ao excluir:', err);
          },
        });
      }
    });
  }

  //Configuração do card
  funcionarioSelecionado = signal<Funcionario | null>(null);

  abrirDetalhes(funcionario: Funcionario) {
    this.funcionarioSelecionado.set(funcionario);
  }

  fecharDetalhes() {
    this.funcionarioSelecionado.set(null);
  }

  //Filtro de status
  filtroStatus: string = 'todos';

  filtrarFuncionarios() {
    if (this.filtroStatus === 'ativos') {
      return this.funcionarios().filter((f) => !f.dataSaida);
    }

    if (this.filtroStatus === 'inativos') {
      return this.funcionarios().filter((f) => f.dataSaida);
    }

    return this.funcionarios();
  }
}

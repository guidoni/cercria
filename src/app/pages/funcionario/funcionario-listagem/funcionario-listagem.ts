import { Component, OnInit, signal, inject } from '@angular/core';
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
  // Signals para armazenar listas vindas dos serviços
  funcionarios = signal<Funcionario[]>([]);

  // Injeção do serviço responsável pelas operações com funcionários
  private servico = inject(FuncionarioService);

  constructor(private toastr: ToastrService) {}

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

  //Método para filtrar os funcionários
  //Um funcionário é considerado ativo quando sua data de saída == NULL
  filtrarFuncionarios() {
    if (this.filtroStatus === 'ativos') {
      return this.funcionarios().filter((f) => !f.dataSaida);
    }

    if (this.filtroStatus === 'inativos') {
      return this.funcionarios().filter((f) => f.dataSaida);
    }

    return this.funcionarios();
  }

  //Método excluir
  excluir(id: number): void {
    Swal.fire({
      title: 'Excluir funcionário?',
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
              next: (retorno) => this.funcionarios.set(retorno),
            });

            this.toastr.success('Funcionário excluído com sucesso!');
          },
          error: (err) => {
            console.error(err);
            this.toastr.error('Erro ao remover funcionário.');
          },
        });
      }
    });
  }
}

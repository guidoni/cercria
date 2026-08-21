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
            //console.error(err);
            this.toastr.error('Erro ao remover funcionário.');
          },
        });
      }
    });
  }

  // Paginação
  paginaAtual: number = 1;

  itensPorPagina: number = 5;

  // Total de páginas
  get totalPaginas(): number {
    return Math.ceil(this.filtrarFuncionarios().length / this.itensPorPagina);
  }

  // Acolhidos que serão exibidos na página atual
  funcionariosPaginados() {
    const lista = this.filtrarFuncionarios();
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;

    return lista.slice(inicio, fim);
  }

  // Páginas que aparecem nos botões
  get paginasVisiveis(): (number | string)[] {
    const total = this.totalPaginas;
    const atual = this.paginaAtual;

    // Se tiver até 5 páginas,
    // mostra todas
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Exemplo:
    // 1 2 3 ... 10
    if (atual <= 3) {
      return [1, 2, 3, '...', total];
    }

    // Exemplo:
    // 1 ... 8 9 10
    if (atual >= total - 2) {
      return [1, '...', total - 2, total - 1, total];
    }

    // Exemplo:
    // 1 ... 4 5 6 ... 10
    return [1, '...', atual - 1, atual, atual + 1, '...', total];
  }

  // Ir para uma página específica
  irParaPagina(pagina: number | string): void {
    // Se for "..." não faz nada
    if (typeof pagina === 'string') {
      return;
    }

    // Evita páginas inválidas
    if (pagina < 1 || pagina > this.totalPaginas) {
      return;
    }

    this.paginaAtual = pagina;
  }

  // Página anterior
  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
    }
  }

  // Próxima página
  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
    }
  }
}

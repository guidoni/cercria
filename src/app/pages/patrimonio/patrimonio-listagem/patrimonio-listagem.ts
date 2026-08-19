import { Component, OnInit, signal, inject } from '@angular/core';
import { Patrimonio } from '../../../models/Patrimonio';
import { PatrimonioService } from '../../../services/patrimonio/patrimonio.service';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Header } from '../../../components/header/header';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patrimonio-listagem',
  imports: [Sidebar, Header, RouterLink, FormsModule, CommonModule],
  templateUrl: './patrimonio-listagem.html',
  styleUrl: './patrimonio-listagem.css',
})
export class PatrimonioListagem implements OnInit {
  // Signal para armazenar lista vinda dos serviços
  patrimonios = signal<Patrimonio[]>([]);

  // Injeção do serviço responsável pelas operações com patrimônio
  private servico = inject(PatrimonioService);
  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {
    this.servico.selecionar().subscribe({
      next: (lista) => {
        this.patrimonios.set(lista);
        this.patrimoniosFiltro.set(lista);
        this.patrimoniosFiltrados.set(lista);
      },
      error: (err) => {
        console.error('erro:', err);
      },
    });
  }

  //Configuração do card
  patrimoniosSelecionado = signal<Patrimonio | null>(null);

  abrirDetalhes(patrimonio: Patrimonio) {
    this.patrimoniosSelecionado.set(patrimonio);
  }

  fecharDetalhes() {
    this.patrimoniosSelecionado.set(null);
  }

  filtroNome = '';
  filtroEspecificacao = '';

  patrimoniosFiltro = signal<Patrimonio[]>([]);
  patrimoniosFiltrados = signal<Patrimonio[]>([]);

  //Filtros
  filtrar() {
    const lista = this.patrimoniosFiltro();

    const filtrados = lista.filter((p) => {
      const tombamentoOk =
        this.filtroNome === '' || p.tombamento.toString().includes(this.filtroNome);

      const especificacaoOk = p.especificacao
        ?.toLowerCase()
        .includes(this.filtroEspecificacao.toLowerCase());

      return tombamentoOk && especificacaoOk;
    });

    this.patrimoniosFiltrados.set(filtrados);
  }

  //Método excluir
  excluir(id: number): void {
    Swal.fire({
      title: 'Excluir patrimônio?',
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
              next: (retorno) => this.patrimonios.set(retorno),
            });

            this.toastr.success('Patrimônio excluído com sucesso!');
          },
          error: (err) => {
            console.error(err);
            this.toastr.error('Erro ao remover patrimônio.');
          },
        });
      }
    });
  }

  //Paginação
  paginaAtual: number = 1;
  itensPorPagina: number = 5;

  // Total de páginas
  get totalPaginas(): number {
    return Math.ceil(this.patrimoniosFiltrados().length / this.itensPorPagina);
  }

  // Patrimônios exibidos na página atual
  patrimoniosPaginados(): Patrimonio[] {
    const lista = this.patrimoniosFiltrados();
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;

    return lista.slice(inicio, fim);
  }

  get paginasVisiveis(): (number | string)[] {
    const total = this.totalPaginas;
    const atual = this.paginaAtual;

    // Nenhuma página
    if (total === 0) {
      return [];
    }

    // Até 5 páginas
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Começo
    // 1 2 3 ... 10
    if (atual <= 3) {
      return [1, 2, 3, '...', total];
    }

    // Final
    // 1 ... 8 9 10
    if (atual >= total - 2) {
      return [1, '...', total - 2, total - 1, total];
    }

    // Meio
    // 1 ... 4 5 6 ... 10
    return [1, '...', atual - 1, atual, atual + 1, '...', total];
  }

  irParaPagina(pagina: number | string): void {
    // Ignora os "..."
    if (typeof pagina === 'string') {
      return;
    }

    // Evita páginas inválidas
    if (pagina < 1 || pagina > this.totalPaginas) {
      return;
    }

    this.paginaAtual = pagina;
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
    }
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
    }
  }
}
